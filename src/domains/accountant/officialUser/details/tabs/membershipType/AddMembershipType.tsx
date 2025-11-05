import {
  AccountBox,
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
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { MembershipFormItems } from "./MembershipFormItems";
import { FormItem } from "types/formItem";

type Props = {
  refetch: () => void;
  addModalFlag: boolean;
  setAddModalFlag: React.Dispatch<React.SetStateAction<boolean>>;
  editeData: any;
  setEditeData: React.Dispatch<React.SetStateAction<any>>;
};

const AddMembershipType = ({
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
    watch,
  } = useForm<any>();

  // const watchedMembershipTypeId = watch("cdMembershipTypeId");
  const watchedMembershipTypeId = watch("cdServiceTypeId");
  const { data: firmOptions } = useQuery<any>({
    queryKey: [`firm/search-all`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: Number(watchedMembershipTypeId) === 63,
  } as any);
  const {
    data: membershipType,
    status: membershipType_status,
    refetch: membershipType_refetch,
  } = useQuery<any>({
    queryKey: [`common-data/find-by-type-all?typeId=26`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
  } as any);
  let formItems: any[] = useMemo(
    () =>
      MembershipFormItems(
        setValue,
        { membershipType, firmOptions },
        watchedMembershipTypeId
      ),
    [membershipType, watchedMembershipTypeId, firmOptions]
  );
  useEffect(() => {
    console.log("editeData=>", getValues());
    if (editeData !== null) {
      reset({
        ...editeData,
      });
    } else
      reset({
        personnelId: id,
      });
  }, [editeData, addModalFlag]);

  const handleClose = () => {
    setAddModalFlag(false);
    reset();

    setEditeData(null);
  };

  useEffect(() => {
    console.log("watchedMembershipTypeId", watchedMembershipTypeId);
  }, [watchedMembershipTypeId]);

  const onSubmit = (data: FormData) => {
    mutate(
      {
        // entity: `membership-type-change/${!!editeData ? "update" : "save"}`,
        entity: `change-service/${!!editeData ? "update" : "save"}`,
        // entity: `firm-director/save`,
        method: !!editeData ? "put" : "post",
        // method:  "post",
        data: {
          ...data,
          // active: true,
          personnelId: id,
        },
      },
      {
        onSuccess: (res: any) => {
          console.log("res=>", res);
          if (!!editeData)
            snackbar(
              `به روز رسانی نوع عضویت انتخاب شده با موفقیت انجام شد`,
              "success"
            );
          else snackbar(`نوع عضویت جدید با موفقیت افزوده شد`, "success");
          refetch();
          //   handleClose();
        },
        onError: () => {
          snackbar("خطا در تغییر نوع عضویت", "error");
        },
      }
    );
  };

  return (
    <Dialog
      open={addModalFlag}
      onClose={handleClose}
      maxWidth={"sm"}
      PaperProps={{
        sx: {
          overflow: "visible", // اجازه به محتوای Dialog برای بیرون زدن
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display={"flex"} textAlign={"center"} alignItems={"center"}>
            <AccountBox fontSize="large" />
            <Typography variant="h6">تغییر عضویت</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ overflow: "visible" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} mt={1} justifyContent={"center"}>
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

export default AddMembershipType;
