import {
  AddCircle,
  ChangeCircle,
  Map,
  People,
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
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useMutation, useQuery } from "@tanstack/react-query";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { EducationalCertificateFormItems } from "../../forms/EducationalCertificateFormItems";

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
  editeEDUPersonelData: any;
  setEditeEDUPersonelData: React.Dispatch<React.SetStateAction<any>>;
  selectedEDUId: any;
};

const AddEDU = ({
  selectedEDUId,
  addAddressFlag,
  setAddAddressFlag,
  refetch,
  editeEDUPersonelData,
  setEditeEDUPersonelData,
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
    data: educationalOptions,
    status:educationalOptions_status,
    refetch: educationalOptions_refetch,
  } = useQuery<any>({
    queryKey: [`common-data/find-by-type-all?typeId=33`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
  } as any);
  const {
    data: personnelOptions,
    status: personnelOptions_status,
    refetch: personnelOptions_refetch,
  } = useQuery<any>({
    queryKey: [`personnel-info/search-all?auditingFirmId=${id}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
  } as any);
  const formItems: any[] = EducationalCertificateFormItems(setValue, { educationalOptions,personnelOptions });
  useEffect(() => {
    console.log("editeEDUPersonelData=>", getValues());
    if (editeEDUPersonelData !== null) {
      reset({
        ...editeEDUPersonelData,
      });
    } else
      reset({
        auditingFirmId: id,
      });
  }, [editeEDUPersonelData, addAddressFlag]);

  const handleClose = () => {
    setAddAddressFlag(false);
    reset();

    setEditeEDUPersonelData(null);
  };

  const onSubmit = (data: FormData) => {
    console.log("data",data)
    // mutate(
    //   {
    //     entity: `firm-prof-edu-personnel/${
    //       !!editeEDUPersonelData ? "update" : "save"
    //     }`,
    //     // entity: `firm-director/save`,
    //     method: !!editeEDUPersonelData ? "put" : "post",
    //     // method:  "post",
    //     data: {
    //       ...data,
    //       // active: true,
    //       // auditingFirmId: selectedEDUId?.id,
    //       auditingFirmId: id,
    //       educationalId:selectedEDUId?.id
    //     },
    //   },
    //   {
    //     onSuccess: (res: any) => {
    //       console.log("res=>", res);
    //       if (!!editeEDUPersonelData)
    //         snackbar(
    //           `به روز رسانی موسسه انتخاب شده با موفقیت انجام شد`,
    //           "success"
    //         );
    //       else snackbar(`دانشپذیر جدید به دوره با موفقیت افزوده شد`, "success");
    //       refetch();
    //       //   handleClose();
    //     },
    //     onError: () => {
    //       snackbar("خطا در افزودن دانشپذیر", "error");
    //     },
    //   }
    // );
  };

  return (
    <Dialog open={addAddressFlag} onClose={handleClose} maxWidth={"md"}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display={"flex"} textAlign={"center"} alignItems={"center"} gap={1}>
            <People fontSize="large" />
            <Typography variant="h6">
              {editeEDUPersonelData ? `ویرایش دانشپذیر انتخاب شده` : `افزودن دانشپذیر فعال جدید`}
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
                  !!editeEDUPersonelData ? <ChangeCircle /> : <AddCircle />
                }
                type="submit"
                disabled={isLoading}
              >
                {isLoading
                  ? !!editeEDUPersonelData
                    ? "در حال به روز رسانی..."
                    : "در حال افزودن..."
                  : !!editeEDUPersonelData
                  ? "به روز رسانی"
                  : "افزودن"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEDU;
