import React, { useEffect, useMemo, useState } from "react";
import {
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  MenuItem,
  Select,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { FullInstituteType } from "types/institute";

// کامپوننت‌های مربوط به هر دسته اطلاعات
import { Inventory } from "@mui/icons-material";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import { useAuth } from "hooks/useAuth";

import BackButton from "components/buttons/BackButton";
import { useLocation, useNavigate } from "react-router-dom";
import { MiniInfoItems } from "./forms/MiniInfo";
import DirectorGrid from "./tabs/director/DiretorGrid";
import { isMobile } from "react-device-detect";
import { TOption } from "types/render";
import ContinuingEducationGrid from "./tabs/continuingEducation/ContinuingEducationGrid";
import PublicationGrid from "./tabs/publication/PublicationGrid";
import BranchGrid from "./tabs/branchs/BranchGrid";
import AddressGrid from "./tabs/address/AddressGrid";

type Props = {};
interface FormItem {
  name: keyof FullInstituteType;
  inputType: string;
  label: string;
  size: { md: number };
  rules?: any;
  options?: any[];
  elementProps?: any;
}
const FirmAdminDetaileTabs = (props: Props) => {
  const { state } = useLocation();
  const Auth = useAuth();
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<any>();
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    reset(state?.firmData);
    console.log("get=>", new Date(getValues()["registerDate"]).toISOString());
  }, [state?.firmData]);

  const tabSteps = [
    {
      title: "مدیرعامل",
      com: <DirectorGrid />,
    },
    // {
    //   title: "آموزشی",
    //   com: <EduInfoGrid setActiveTab={setActiveTab} />,
    // },
    // {
    //   title: "مالی",
    //   com: <FinancialStatementsGrid setActiveTab={setActiveTab} />,
    // },
    {
      // title: "آموزش مستمر حرفه ای",
      title: "سوابق مستمر آموزشی",
      com: <ContinuingEducationGrid setActiveTab={setActiveTab} />,
    },
    // {
    //   title: "قراردادها",
    //   com: <FirmContractGrid />,
    // },
    {
      title: "انتشارات",
      com: <PublicationGrid />,
    },
    {
      title: "شعبه",
      com: <BranchGrid />,
    },
    {
      title: "آدرس",
      com: <AddressGrid />,
    },
  ];

  const formItems = useMemo(
    () => MiniInfoItems(setValue, getValues),
    [getValues, setValue, state?.firmData]
  ); // وابستگی‌های useMemo

  const handleTabChange = (event: any, newValue: number) => {
    setActiveTab(newValue);
  };
  return (
    <Grid container justifyContent={"center"}>
      <Grid
        item
        md={11}
        sm={11}
        xs={12}
        display={"flex"}
        justifyContent={"space-between"}
        mb={1}
      >
        <Grid item display={"flex"}>
          <Inventory fontSize={isMobile ? "medium" : "large"} />
          <Typography variant={isMobile ? "body1" : "h5"}>
            مدیریت جزئیات موسسه {state?.firmData?.name}
          </Typography>
        </Grid>
        <Grid item display={"flex"}>
          <BackButton onBack={() => navigate(-1)} />
        </Grid>
      </Grid>
      <Grid item md={11}>
        <Paper sx={{ width: "100%", p: 5 }}>
          <Grid item container md={12} spacing={2}>
            <Grid item md={12}>
              <Typography variant="h6">اطلاعات کلی موسسه</Typography>
            </Grid>
            {formItems?.map((item) => (
              <Grid item xs={12} md={item.size.md} key={item.name}>
                <Controller
                  name={item.name}
                  control={control}
                  rules={item.rules}
                  render={({ field }) => (
                    <RenderFormInput
                      controllerField={field}
                      errors={errors}
                      {...item}
                      {...field}
                      onChange={(e: any) => {
                        // if (!isNaN(e.target.value))
                        setValue(item.name, e.target.value);
                      }}
                      value={getValues()[item.name] ?? ""}
                    />
                  )}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
      <Grid
        item
        md={11}
        sm={11}
        xs={12}
        display={"flex"}
        justifyContent={"flex-start"}
      >
        {isMobile ? (
          <Select
            sx={{ width: "25vw", mr: 1, mt: 2 }}
            label={"پنل"}
            value={activeTab}
            size="small"
            onChange={(e) => setActiveTab((e.target.value as number) ?? 0)}
          >
            {tabSteps?.map((option: TOption, index: number) => (
              <MenuItem key={`select-item-${option.value}`} value={index}>
                {option.title}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Tabs
            sx={{
              mt: 2,
              mr: 1,
              direction: "rtl",
              // maxWidth: "45vw",
              // direction: "rtl",
            }}
            value={activeTab}
            onChange={handleTabChange}
            variant={"scrollable"}
            scrollButtons={"auto"}
          >
            {tabSteps.map((tab, index) => (
              <Tab
                // wrapped
                key={index}
                label={tab.title}
                id={`tab-${index}`}
                aria-controls={`tabpanel-${index}`}
              />
            ))}
          </Tabs>
        )}
      </Grid>
      {tabSteps[activeTab].com}
    </Grid>
  );
};

export default FirmAdminDetaileTabs;
