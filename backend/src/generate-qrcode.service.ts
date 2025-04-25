import * as QrCode from "qrcode";

export class QrCodeGenerateService {
  async generate(text: string) {
    return await QrCode.toDataURL(text);
  }
}
