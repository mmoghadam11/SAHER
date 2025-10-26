import {
  AddCircle,
  ChangeCircle,
  EventNote,
  Man4,
  Map,
  Receipt,
  School,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Button,
  IconButton,
  Box,
  Autocomplete,
  TextField,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useMutation, useQuery } from "@tanstack/react-query";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { EduFinancialItems } from "../../forms/FinancialItems";
import { ContinuingEduItems } from "../../forms/ContinuingEduItems";
import { BranchFormItems } from "../../forms/BranchFormItems";

interface FormData {
  id?: any;
  termName: string;
  auditingFirmId: string;
  applicatorName: string;
  hour_count: string;
  request_year: string;
  request_month: string;
}

type Props = {
  refetch: () => void;
  addModalFlag: boolean;
  setAddModalFlag: React.Dispatch<React.SetStateAction<boolean>>;
  editeData: any;
  setEditeData: React.Dispatch<React.SetStateAction<any>>;
};

const AddBranch = ({
  addModalFlag,
  setAddModalFlag,
  refetch,
  editeData,
  setEditeData,
}: Props) => {
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const { id } = useParams();

  const { mutate, isLoading } = useMutation({
    mutationFn: Auth?.serverCall,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<FormData>();

  const {
    data: ownershipTypeOptions,
    status: ownershipTypeOptions_status,
    refetch: ownershipTypeOptions_refetch,
  } = useQuery<any>({
    queryKey: [`common-data/find-by-type-all?typeId=15`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
  } as any);
  const {
    data: PersonnelInfo,
    status: PersonnelInfo_status,
    refetch: PersonnelInfo_refetch,
  } = useQuery<any>({
    queryKey: [`certified-accountant/search-all?auditingFirmId=${id}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
  } as any);
  const formItems: any[] = BranchFormItems(setValue, {
    ownershipTypeOptions,
    PersonnelInfo,
  });
  useEffect(() => {
    console.log("editeData=>", getValues());
    if (editeData !== null) {
      reset({
        ...editeData,
      });
    } else
      reset({
        auditingFirmId: id,
      });
  }, [editeData, addModalFlag]);

  const handleClose = () => {
    setAddModalFlag(false);
    reset();

    setEditeData(null);
  };

  const onSubmit = (data: FormData) => {
    mutate(
      {
        entity: `audited-firm-branch/${!!editeData ? "update" : "save"}`,
        // entity: `firm-director/save`,
        method: !!editeData ? "put" : "post",
        // method:  "post",
        data: {
          ...data,
          // active: true,
          firmId: id,
        },
      },
      {
        onSuccess: (res: any) => {
          console.log("res=>", res);
          if (!!editeData)
            snackbar(
              `به روز رسانی موسسه انتخاب شده با موفقیت انجام شد`,
              "success"
            );
          else snackbar(`شعبه جدید با موفقیت افزوده شد`, "success");
          refetch();
          //   handleClose();
        },
        onError: () => {
          snackbar("خطا در ایجاد شعبه", "error");
        },
      }
    );
  };

  return (
    <Dialog
      open={addModalFlag}
      onClose={handleClose}
      maxWidth={"md"}
      PaperProps={{
        sx: {
          overflow: "visible", // اجازه به محتوای Dialog برای بیرون زدن
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display={"flex"} textAlign={"center"} alignItems={"center"}>
            <EventNote fontSize="large" />
            <Typography variant="h6">
              {editeData ? `ویرایش شعبه انتخاب شده` : `ایجاد شعبه جدید`}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{overflow:"visible"}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} mt={1}>
            {formItems.map((item) => (
              <Grid item xs={12} md={item.size.md} key={item.name}>
                <Controller
                  name={item.name}
                  control={control}
                  rules={item.rules}
                  render={({ field }) => (
                    <RenderFormInput
                      value={(getValues() as any)[item.name]}
                      controllerField={field}
                      errors={errors}
                      {...item}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        // handleInputChange(item.name, e.target.value);
                        field.onChange(e);
                      }}
                    />
                  )}
                />
              </Grid>
            ))}

            <Grid item xs={12} display="flex" justifyContent="flex-end" mt={2}>
              <Button variant="outlined" onClick={handleClose} sx={{ mr: 2 }}>
                بازگشت
              </Button>
              <Button
                variant="contained"
                startIcon={!!editeData ? <ChangeCircle /> : <AddCircle />}
                type="submit"
                disabled={isLoading}
              >
                {isLoading
                  ? !!editeData
                    ? "در حال به روز رسانی..."
                    : "در حال ایجاد..."
                  : !!editeData
                  ? "به روز رسانی"
                  : "ایجاد"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBranch;
