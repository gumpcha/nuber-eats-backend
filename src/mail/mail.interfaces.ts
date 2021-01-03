export interface MailConfigOptions {
  api_key: string;
  domain_name: string;
  from_email: string;
}

export interface MailTemplateVars {
  key: string;
  value: string;
}
