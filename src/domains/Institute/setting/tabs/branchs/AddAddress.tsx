import {
  AddCircle,
  ChangeCircle,
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
import { EduFinancialItems } from "../../forms/FinancialItems";
import { ContinuingEduItems } from "../../forms/ContinuingEduItems";
import { BranchFormItems } from "../../forms/BranchFormItems";
import { BranchAddressFormItems } from "../../forms/BranchAddressFormItems";

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
  addAddressFlag: boolean;
  setAddAddressFlag: React.Dispatch<React.SetStateAction<boolean>>;
  editeAddressData: any;
  setEditeAddressData: React.Dispatch<React.SetStateAction<any>>;
  selectedBranch: any;
};

const AddAddress = ({
  selectedBranch,
  addAddressFlag,
  setAddAddressFlag,
  refetch,
  editeAddressData,
  setEditeAddressData,
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
    data: cityOptions,
    status: cityOptions_status,
    refetch: cityOptions_refetch,
  } = useQuery<any>({
    // queryKey: [process.env.REACT_APP_API_URL + `/api/unit-allocations${paramsSerializer(filters)}`],
    // queryKey: [`/api/v1/common-type/find-all${paramsSerializer(filters)}`],
    queryKey: [`city/search-all`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
  } as any);
  const formItems: any[] = BranchAddressFormItems(setValue, { cityOptions });
  useEffect(() => {
    console.log("editeAddressData=>", getValues());
    if (editeAddressData !== null) {
      reset({
        ...editeAddressData,
      });
    } else
      reset({
        auditingFirmId: id,
      });
  }, [editeAddressData, addAddressFlag]);

  const handleClose = () => {
    setAddAddressFlag(false);
    reset();

    setEditeAddressData(null);
  };

  const onSubmit = (data: FormData) => {
    mutate(
      {
        entity: `audited-firm-branch/${
          !!editeAddressData ? "update" : "save"
        }-address`,
        // entity: `firm-director/save`,
        method: !!editeAddressData ? "put" : "post",
        // method:  "post",
        data: {
          ...data,
          // active: true,
          firmBranchId: selectedBranch?.id,
          active: true,
        },
      },
      {
        onSuccess: (res: any) => {
          console.log("res=>", res);
          if (!!editeAddressData)
            snackbar(
              `به روز رسانی موسسه انتخاب شده با موفقیت انجام شد`,
              "success"
            );
          else snackbar(`آدرس جدید با موفقیت افزوده شد`, "success");
          refetch();
          //   handleClose();
        },
        onError: () => {
          snackbar("خطا در ایجاد آدرس", "error");
        },
      }
    );
  };

  return (
    <Dialog open={addAddressFlag} onClose={handleClose} maxWidth={"md"}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display={"flex"} textAlign={"center"} alignItems={"center"}>
            <Map fontSize="large" />
            <Typography variant="h6">
              {editeAddressData ? `ویرایش آدرس انتخاب شده` : `ایجاد آدرس فعال جدید`}
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
                  !!editeAddressData ? <ChangeCircle /> : <AddCircle />
                }
                type="submit"
                disabled={isLoading}
              >
                {isLoading
                  ? !!editeAddressData
                    ? "در حال به روز رسانی..."
                    : "در حال ایجاد..."
                  : !!editeAddressData
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

export default AddAddress;
