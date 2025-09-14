export interface FullInstituteType {
  /**@description اطلاعات پایه */
  instituteName: string;
  englishName: string;
  nationalId: string;
  registrationNumber: string;
  registrationDate: string;
  registrationLocation: string;
  establishmentDate: string;
  status: string;
  
  /**@description اطلاعات عضویت و پروانه */
  membershipNumber: string;
  membershipDate: string;
  licenseNumber: string;
  licenseDate: string;
  licenseExpiry: string;
  lastLicenseDate: string;
  
  /**@description اطلاعات مالی */
  economicCode: string;
  taxCode: string;
  fiscalYear: string;
  fiscalYearStart: string;
  fiscalYearEnd: string;
  ownershipType: string;
  officeArea: string;
  
  /**@description  اطلاعات تماس*/
  phone: string;
  fax: string;
  email: string;
  website: string;
  
  /**@description اطلاعات مدیرعامل*/
  ceoFirstName: string;
  ceoLastName: string;
  ceoNationalId: string;
  ceoStartDate: string;
  ceoEndDate: string;
  ceoMobile: string;
  
  /**@description اطلاعات هیئت مدیره */
  boardMembers: string;
  boardMembersNationalIds: string;
  boardMembersStartDate: string;
  boardMembersEndDate: string;
  
  /**@description رتبه‌بندی و کنترل */
  statusRank: string;
  statusScore: string;
  statusRankDate: string;
  statusRankLetterNumber: string;
  qualityRank: string;
  qualityScore: string;
  qualityRankDate: string;
  qualityRankLetterNumber: string;
  
  /**@description اطلاعات تخصصی */
  stockExchangeTrustee: string;
  stockExchangeTrusteeDate: string;
  stockExchangeRejectionDate: string;
  centralBankTrustee: string;
  insuranceTrustee: string;
  auditCourtTrustee: string;
  amlManagerName: string;
  amlManagerNationalId: string;
  societyRelationType: string;
  auditorName: string;
  mergerDate: string;
  mergedInstituteName: string;
  mergedInstituteMembership: string;
  dissolutionDate: string;
  dissolutionGazetteNumber: string;
  dissolutionGazetteDate: string;
}