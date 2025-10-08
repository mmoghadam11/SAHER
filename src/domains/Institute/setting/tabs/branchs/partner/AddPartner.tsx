import {
  AddCircle,
  ChangeCircle,
  Diversity3,
  EventNote,
  Man4,
  Map,
  MapTwoTone,
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
import { PartnerFormItems } from "./PartnerFormItems";

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
  addPartnerFlag: boolean;
  setAddPartnerFlag: React.Dispatch<React.SetStateAction<boolean>>;
  editePartnerData: any;
  setEditePartnerData: React.Dispatch<React.SetStateAction<any>>;
  selectedBranch: any;
};

const AddPartner = ({
  selectedBranch,
  addPartnerFlag,
  setAddPartnerFlag,
  refetch,
  editePartnerData,
  setEditePartnerData,
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
        data: PersonnelInfo,
        status: PersonnelInfo_status,
        refetch: PersonnelInfo_refetch,
      } = useQuery<any>({
  
        queryKey: [`personnel-info/search-all`],
        queryFn: Auth?.getRequest,
        select: (res: any) => {
          return res?.data;
        },
      } as any);
  const formItems: any[] = PartnerFormItems({PersonnelInfo});
  useEffect(() => {
    console.log("editePartnerData=>", getValues());
    if (editePartnerData !== null) {
      reset({
        ...editePartnerData,
      });
    } else
      reset({
        auditingFirmId: id,
      });
  }, [editePartnerData, addPartnerFlag]);

  const handleClose = () => {
    setAddPartnerFlag(false);
    reset();

    setEditePartnerData(null);
  };

  const onSubmit = (data: FormData) => {
    mutate(
      {
        entity: `audited-firm-branch/${
          !!editePartnerData ? "update" : "save"
        }-partner`,
        // entity: `firm-director/save`,
        method: !!editePartnerData ? "put" : "post",
        // method:  "post",
        data: {
          ...data,
          // active: true,
          auditingFirmBranchId: selectedBranch?.id,
          auditingFirmId: id,
        },
      },
      {
        onSuccess: (res: any) => {
          console.log("res=>", res);
          if (!!editePartnerData)
            snackbar(
              `به روز رسانی شریک انتخاب شده با موفقیت انجام شد`,
              "success"
            );
          else snackbar(`شریک جدید با موفقیت افزوده شد`, "success");
          refetch();
          //   handleClose();
        },
        onError: () => {
          snackbar("خطا در ایجاد شریک", "error");
        },
      }
    );
  };

  return (
    <Dialog open={addPartnerFlag} onClose={handleClose} maxWidth={"md"}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display={"flex"} textAlign={"center"} alignItems={"center"} gap={1}>
            <Diversity3 fontSize="large" />
            <Typography variant="h6">
              {editePartnerData ? `ویرایش شریک انتخاب شده` : `ایجاد شریک جدید`}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
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
                startIcon={
                  !!editePartnerData ? <ChangeCircle /> : <AddCircle />
                }
                type="submit"
                disabled={isLoading}
              >
                {isLoading
                  ? !!editePartnerData
                    ? "در حال به روز رسانی..."
                    : "در حال ایجاد..."
                  : !!editePartnerData
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

export default AddPartner;
