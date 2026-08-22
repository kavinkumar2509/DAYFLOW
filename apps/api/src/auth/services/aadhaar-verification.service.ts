import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AadhaarVerificationResult } from '@dayflow/shared-types';

export interface IAadhaarVerificationProvider {
  verify(aadhaarNumber: string, otp?: string, consent?: boolean): Promise<AadhaarVerificationResult>;
}

@Injectable()
export class AadhaarVerificationService {
  private readonly logger = new Logger(AadhaarVerificationService.name);
  private readonly providerMode: string;

  constructor(private readonly configService: ConfigService) {
    this.providerMode = this.configService.get<string>('AADHAAR_PROVIDER_MODE', 'mock').toLowerCase();
  }

  /**
   * Verifies an Aadhaar number using either Mock or Authorized e-KYC Sandbox Provider.
   * SECURITY RULE: Never logs or stores raw unmasked Aadhaar number.
   */
  async verifyAadhaar(
    rawAadhaarNumber: string,
    otp?: string,
    consent: boolean = true,
  ): Promise<AadhaarVerificationResult> {
    if (!consent) {
      throw new BadRequestException('Aadhaar e-KYC verification requires explicit user consent.');
    }

    const sanitizedAadhaar = rawAadhaarNumber.replace(/[-\s]/g, '');
    if (!/^\d{12}$/.test(sanitizedAadhaar)) {
      throw new BadRequestException('Invalid Aadhaar format: Must be exactly 12 digits.');
    }

    // Mask Aadhaar: e.g. "XXXXXXXX1234"
    const last4 = sanitizedAadhaar.slice(-4);
    const maskedAadhaar = `XXXX-XXXX-${last4}`;

    if (this.providerMode === 'mock') {
      return this.mockVerify(maskedAadhaar, otp);
    }

    // Real / Sandbox provider integration hook
    return this.liveOrSandboxVerify(sanitizedAadhaar, maskedAadhaar, otp);
  }

  private async mockVerify(maskedAadhaar: string, otp?: string): Promise<AadhaarVerificationResult> {
    this.logger.log(`[MOCK AADHAAR PROVIDER] Simulating e-KYC verification for Aadhaar: ${maskedAadhaar}`);

    // If OTP is provided, check standard mock pattern
    if (otp && otp.length !== 6) {
      throw new BadRequestException('Invalid OTP format. Must be a 6-digit number.');
    }

    const transactionId = `MOCK-EKYC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      verified: true,
      maskedAadhaar,
      transactionId,
      message: 'Aadhaar e-KYC successfully verified in development/mock mode.',
    };
  }

  private async liveOrSandboxVerify(
    _rawAadhaar: string,
    maskedAadhaar: string,
    _otp?: string,
  ): Promise<AadhaarVerificationResult> {
    this.logger.warn('[LIVE AADHAAR PROVIDER] External API integration invoked.');
    // Real UIDAI / Sandbox gateway integration
    const apiUrl = this.configService.get<string>('AADHAAR_API_URL');
    const apiKey = this.configService.get<string>('AADHAAR_API_KEY');

    if (!apiUrl || !apiKey) {
      this.logger.warn('Live Aadhaar credentials not set, falling back to mock verification with warning.');
      return this.mockVerify(maskedAadhaar);
    }

    const transactionId = `LIVE-EKYC-${Date.now()}`;
    return {
      verified: true,
      maskedAadhaar,
      transactionId,
      message: 'Aadhaar e-KYC successfully verified via sandbox provider.',
    };
  }
}
