import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Autocomplete,
  FormHelperText,
  LinearProgress,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ErrorHandler from "components/errorHandler/ErrorHandler";
import React, { forwardRef } from "react";
import { IRenderFormInput, TOption } from "types/render";
import CustomDatePicker from "../datePicker/CustomDatePicker";
import PasswordInput from "./PasswordInput";
import DatePicker from "react-multi-date-picker";
// import SelectCity from "./SelectCity.bak-tsx";
// import SelectLocation from "./SelectLocation";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import moment from "jalali-moment";

const RenderFormInput: React.FC<IRenderFormInput> = forwardRef((props, ref) => {
  const {
    name,
    label,
    errors,
    elementProps = {},
    controllerField,
    onChange,
    value,
    defaultValue,
    placeholder,
    Defaultfont = false,
  } = props;
  if (props.inputType === "text") {
    return (
      <TextField
        name={name}
        label={label}
        error={Boolean(errors?.[name]?.message)}
        helperText={errors?.[name]?.message}
        {...controllerField}
        {...elementProps}
        inputRef={ref}
        fullWidth
        size="small"
        inputProps={{ style: !Defaultfont ? { fontSize: 16 } : null }} // font size of input text
        InputLabelProps={{ style: !Defaultfont ? { fontSize: 16 } : null }}
        onChange={onChange}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    );
  }
  if (props.inputType === "password") {
    return (
      <PasswordInput
        name={name}
        label={label}
        errors={errors?.[name]?.message}
        controllerField={controllerField}
        elementProps={elementProps}
      />
    );
  }
  if (props.inputType === "date") {
    const { setValue, watch, format } = props;
    // console.log("elementProps",elementProps.value)
    // console.log("jalali",moment(new Date(elementProps.value)).format("jYYYY/jMM/jDD"))
    return (
      <CustomDatePicker
        ref={ref}
        name={name}
        label={label}
        setDay={(day:any) => {
          setValue(name, day);
          // همچنین مقدار را به react-hook-form گزارش دهید
          if (controllerField.onChange) {
            controllerField.onChange(day);
          }
        }}
        // value={watch(name)}
        disabled={ elementProps?.disabled}
        format={format}
        value={ elementProps.value}
        {...elementProps}
        {...controllerField}
        error={errors?.[name]?.message}
        onChange={controllerField.onChange}
      />
      //   <Box sx={{ width: "100%" }}>
      //   <Box
      //     className="date-field"
      //     sx={{
      //       position: "relative",
      //       display: "flex",
      //       height: "40px",
      //       alignItems: "center",
      //       borderRadius: "4px",
      //       width: "100%",

      //       // border: (theme) => `1px solid ${theme.palette.grey[400]}`,
      //       // ":hover": {
      //       //   border: (theme) => `1px solid ${theme.palette.grey[700]}`,
      //       // },
      //       // ":focus": {
      //       //   border: (theme) => `1px solid ${theme.palette.grey[700]}`,
      //       // },
      //     }}
      //   >
      //     <Box
      //       onClick={() => {
      //         let element = document.getElementsByName(name);
      //         element?.[0].focus();
      //       }}
      //       component="legend"
      //       fontSize={12}
      //       sx={{
      //         paddingLeft: 0.5,
      //         height: "100%",
      //         borderRadius: "4px 0px 0px 4px",
      //         backgroundColor: (theme) => theme.palette.grey[300],
      //         display: "flex",
      //         alignItems: "center",
      //         // mr: 2,
      //         px: 1,
      //       }}
      //     >
      //       {label}
      //     </Box>
      //     <DatePicker
      //       calendar={persian}
      //       locale={persian_fa}
      //       calendarPosition="bottom-right"
      //       containerClassName="date-input"
      //       // format={format}
      //       {...elementProps}
      //       {...controllerField}
      //       onChange={(e)=>console.log("DATE",e?.getValue)}
      //       value={value}
      //       style={{ height: "100%", minWidth: "100px", borderRadius: "4px 0px 0px 4px", margin: "0px", width: "100%" }}
      //       placeholder="انتخاب تاریخ ..."
      //       name={name}
      //     />
      //     {value && (
      //       <HighlightOffIcon onClick={() => setDay("")} sx={{ ml: -3, color: (theme) => theme.palette.grey[600] }} />
      //     )}
      //   </Box>
      //   {/* {error && <FormHelperText error={true}>{error}</FormHelperText>} */}
      // </Box>
    );
  }
  // if (props.inputType === "autocomplete") {
  //   let { options, status, refetch } = props;
  //   if (status === "loading") return <LoadingState label={label} />;
  //   if (status === "error" && refetch) return <ErrorState label={label} refetch={refetch} />;
  //   return (
  //     <Autocomplete
  //       {...controllerField}
  //       {...elementProps}
  //       options={options}
  //       //@ts-ignore
  //       getOptionLabel={(option: TOption) => {
  //         if (typeof option !== "object") {
  //           let result = options.find((op: TOption) => op?.value === option);
  //           return result?.title || "";
  //         }
  //         return option?.title || "";
  //       }}
  //       filterOptions={(ops, state) => {
  //         //@ts-ignore
  //         let temp = ops?.filter((op: TOption) => op?.title?.includes(state?.inputValue));
  //         return temp;
  //       }}
  //       value={controllerField?.value}
  //       renderInput={(params) => (
  //         <TextField
  //           {...params}
  //           variant="outlined"
  //           label={label}
  //           error={Boolean(errors?.[name]?.message)}
  //           helperText={errors?.[name]?.message}
  //           size="small"
  //         />
  //       )}
  //     />
  //   );
  // }
  if (props.inputType === "autocomplete") {
    let { options, status, refetch, customOnChange, externalValue } = props;
    if (status === "loading") return <LoadingState label={label} />;
    if (status === "error" && refetch)
      return <ErrorState label={label} refetch={refetch} />;

    return (
      <Autocomplete
        ref={ref}
        {...controllerField}
        {...elementProps}
        options={options}
        //@ts-ignore
        getOptionLabel={(option: TOption) => {
          if (typeof option !== "object") {
            let result = options.find((op: TOption) => op?.value === option);
            return result?.title || "";
          }
          return option?.title || "";
        }}
        filterOptions={(ops, state) => {
          //@ts-ignore
          let temp = ops?.filter((op: TOption) =>
            op?.title?.includes(state?.inputValue)
          );
          return temp;
        }}
        // value={
        //   externalValue !== undefined ? externalValue : controllerField?.value
        // }
         value={controllerField?.value || null}
        onChange={(event, newValue:any, reason) => {
          // Call custom onChange if provided
          if (customOnChange) {
            customOnChange(event, newValue, reason);
          }
          // Also call react-hook-form's onChange
          controllerField.onChange(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={label}
            error={Boolean(errors?.[name]?.message)}
            helperText={errors?.[name]?.message}
            size="medium"
          />
        )}
        isOptionEqualToValue={(option:any, value:any) => {
        // اگر value هنوز تنظیم نشده (null/undefined)، false برگردان
        if (!value) return false;
        // مقایسه شناسه‌های منحصر به فرد
        return option.value === value.value;
      }}
      />
    );
  }

  if (props.inputType === "select") {
    let { options, status, refetch } = props;
    if (status === "loading") return <LoadingState label={label} />;
    if (status === "error" && refetch)
      return <ErrorState label={label} refetch={refetch} />;
    
    return (
      <FormControl fullWidth>
        <InputLabel id={`select-input-${name}`}>{label}</InputLabel>
        <Select
          ref={ref}
          labelId={`select-input-${name}`}
          label={label}
          {...controllerField}
          {...elementProps}
          value={controllerField.value===false?"false":controllerField.value || ""}
          error={Boolean(errors?.[name]?.message)}
          size="small"
        >
          {options?.map((option: TOption) => (
            <MenuItem
              key={`${name}-select-item-${option.value}`}
              value={option.value}
            >
              {option.title}
            </MenuItem>
          ))}
        </Select>
        {Boolean(errors?.[name]?.message) && (
          <FormHelperText error={true}>
            {errors?.[name]?.message}
          </FormHelperText>
        )}
      </FormControl>
    );
  }
  if (props.inputType === "titleDivider") {
    return (
      <Box width="100%">
        <Typography>{label}</Typography>
      </Box>
    );
  }
  // if (props.inputType === "city") {
  //   const { setValue, disabled, cityId } = elementProps;
  //   if (!setValue) throw Error("set value not defined");
  //   return <SelectCity label={label} name={name} setValue={setValue} disabled={disabled} cityId={cityId} />;
  // }
  if (props.inputType === "checkbox") {
    const { disabled = false, onClick = () => {} } = elementProps;
    return (
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              name={name}
              size="small"
              disabled={disabled}
              checked={controllerField.value}
              onChange={controllerField.onChange}
            />
          }
          label={<Typography variant="body2">{label}</Typography>}
          onClick={onClick}
          {...controllerField}
          {...elementProps}
        />
        {Boolean(errors?.[name]?.message) && (
          <FormHelperText error={true}>
            {errors?.[name]?.message}
          </FormHelperText>
        )}
      </FormGroup>
    );
  }

  // if (props.inputType === "location") {
  //   const { setValue, watch } = elementProps;
  //   if (!setValue) throw Error("set value not defined");
  //   if (!watch) throw Error("watch is not defined");
  //   return <SelectLocation watch={watch} setValue={setValue} />;
  // }

  return <h1>not supported type</h1>;
});

export default RenderFormInput;

export const LoadingState: React.FC<{ label?: string }> = ({ label }) => {
  return (
    <Box sx={{ minHeight: "40px" }}>
      <Typography variant="caption" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <LinearProgress />
    </Box>
  );
};
const ErrorState: React.FC<{ label?: string; refetch: () => void }> = ({
  label,
  refetch,
}) => {
  return (
    <ErrorHandler onRefetch={refetch} errorText={`خطا در دریاف ${label} ها`} />
  );
};
