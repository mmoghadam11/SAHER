export interface FormItem {
  name: string;
  inputType: string;
  label: string;
  size: { md: number };
  rules?: any;
  tempRules?: any;
  options?: any[];
  elementProps?: any;
  placeholder?: string;
  storeValueAs?: string;

  inlineLoading?:boolean;
  status?: string;
  refetch?: () => void;
  skipClientFilter?: boolean
}
