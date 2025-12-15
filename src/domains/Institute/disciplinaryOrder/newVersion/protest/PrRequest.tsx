import { AddCircle, Close, PanTool } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import RenderFormDisplay from "components/render/formInputs/RenderFormDisplay";
import { FormItem } from "types/formItem";

// مسیر هوک را بر اساس ساختار پروژه خودتان تنظیم کنید

type Props = {
  editable: boolean;
  refetch: () => void;
  addModalFlag: boolean;
  setAddModalFlag: React.Dispatch<React.SetStateAction<boolean>>;
  editeData: any;
  setEditeData: React.Dispatch<React.SetStateAction<any>>;
};

const PrRequest = ({
  editable,
  addModalFlag,
  setAddModalFlag,
  refetch,
  editeData,
  setEditeData,
}: Props) => {
  // دیگر نیازی به id از useParams در این کامپوننت نیست
  // const { id } = useParams();
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm<any>();

  const {
    data: objectionData,
    status: objectionData_status,
    refetch: objectionData_refetch,
  } = useQuery<any>({
    queryKey: [
      `disciplinary-case/find-objection?disciplinaryCaseId=${editeData?.id}`,
    ],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: !!editeData&&addModalFlag,
  } as any);

  const { mutate, isLoading } = useMutation({
    mutationFn: Auth?.serverCall,
    onSuccess: () => {
      snackbar(
        !!editeData
          ? `دعوتنامه با موفقیت به‌روزرسانی شد`
          : `دعوتنامه جدید با موفقیت افزوده شد`,
        "success"
      );
      refetch();
      handleClose();
    },
    onError: () => {
      snackbar("خطا در ثبت دعوتنامه", "error");
    },
  });
  const handleClose = () => {
    setAddModalFlag(false);
    setEditeData(null);
    reset({
      objectionLetterNumber: "",
      objectionLetterDate: "",
      objectionDate: "",
      objectionText: "",
    });
  };
  const onSubmit = (data: any) => {
    const {
      objectionLetterNumber,
      objectionLetterDate,
      objectionDate,
      objectionText,
      ...restOfData
    } = data;
    const submissionData = {
      objectionLetterNumber,
      objectionLetterDate,
      objectionDate,
      objectionText,
      disciplinaryCaseId: editeData?.id ?? null,
    };

    console.log("submissionData", submissionData);
    mutate({
      entity: `disciplinary-case/register-objection`,
      method: "put",
      data: submissionData,
    });
  };
  // فراخوانی هوک سفارشی با تمام منطق
  const formItems: FormItem[] = useMemo(
    () => [
      {
        name: "objectionLetterNumber",
        inputType: "text",
        label: "شماره نامه",
        size: { md: 4 },
        // rules: { required: "شاکی الزامی است" },
      },
      {
        name: "objectionLetterDate",
        inputType: "date",
        label: "تاریخ نامه",
        size: { md: 4 },
        elementProps: {
          setDay: (value: any) => setValue("accuserPrimaryMeetingDate", value),
        },
      },
      {
        name: "objectionDate",
        inputType: "date",
        label: "تاریخ اعتراض",
        size: { md: 4 },
        elementProps: {
          setDay: (value: any) => setValue("boardMeetingDate", value),
        },
      },
      {
        name: "objectionText",
        inputType: "text",
        label: "متن اعتراض",
        size: { md: 12 },
        elementProps: {
          multiline: true,
          rows: 3,
        },
        // rules: { required: "شاکی الزامی است" },
      },
    ],
    [objectionData, reset, editeData]
  );

  useEffect(() => {
      reset(
        objectionData ?? {
          objectionLetterNumber: "",
          objectionLetterDate: "",
          objectionDate: "",
          objectionText: "",
        }
      );    
  }, [editeData, reset, objectionData]);

  return (
    <Dialog
      open={addModalFlag}
      onClose={handleClose}
      maxWidth={"sm"}
      PaperProps={{ sx: { overflow: "visible" } }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" textAlign="center" alignItems="center" gap={1}>
            <PanTool fontSize="medium" />
            <Typography variant="body1" fontSize={"large"}>
              درخواست اعتراض به حکم انتظامی بدوی
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        // sx={editable ? { overflowx: "visible", overflowY: "auto" } : {}}
        sx={{ overflow: "visible" }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} mt={1}>
            {formItems.map((item) => (
              <Grid item xs={12} md={item.size.md} key={item.name}>
                <Controller
                  name={item.name}
                  control={control}
                  rules={item?.rules}
                  render={({ field }) =>
                    editable ? (
                      <RenderFormInput
                        controllerField={field}
                        errors={errors}
                        {...item}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          // handleInputChange(item.name, e.target.value);
                          field.onChange(e);
                        }}
                        value={(getValues() as any)[item.name] ?? ""}
                      />
                    ) : (
                      <RenderFormDisplay
                        item={item}
                        value={(getValues() as any)[item.name]}
                      />
                    )
                  }
                />
              </Grid>
            ))}

            <Grid item xs={12} display="flex" justifyContent="flex-end" mt={2}>
              <Button variant="outlined" onClick={handleClose} sx={{ mr: 2 }}>
                بازگشت
              </Button>
              {editable && (
                <Button
                  variant="contained"
                  startIcon={<AddCircle />}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "در حال ثبت..." : "ثبت"}
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PrRequest;
