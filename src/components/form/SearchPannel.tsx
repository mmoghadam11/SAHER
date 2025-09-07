import { Search } from "@mui/icons-material";
import { Grid, Paper, Button } from "@mui/material";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import React from "react";
import { Controller, useForm } from "react-hook-form";

type Props<T> = {
  searchItems: any[];
  setSearchData: React.Dispatch<React.SetStateAction<T>>;
  searchData: T;
  setFilters: React.Dispatch<any>;
};

function SearchPannel<T extends Record<string, any>>({
  searchItems,
  setSearchData,
  searchData,
  setFilters,
}: Props<T>) {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const handleSearch = () => {
    // ایجاد فیلترها به صورت داینامیک بر اساس searchItems
    const newFilters: Record<string, any> = {};

    searchItems.forEach((item) => {
      if (searchData[item.name] !== undefined) {
        newFilters[item.name] = searchData[item.name];
      }
    });

    setFilters((prev: any) => ({
      ...prev,
      ...newFilters,
    }));
  };
  return (
    <Grid
      item
      md={11}
      sm={11}
      xs={12}
    >
      <Paper elevation={3} sx={{ p: 3, mt: 1, mb: 2 ,width:"100%"}}>
        <Grid item container md={12} justifyContent={"space-between"} spacing={3}>
          <Grid item container md={9} spacing={2}>
            {searchItems.map((item, itemKey) => (
              <Grid
                item
                key={item.name + itemKey}
                xs={12}
                md={item?.size?.md || 3}
              >
                <Controller
                  name={item.name}
                  control={control}
                  render={({ field }) => {
                    return (
                      <RenderFormInput
                        controllerField={field}
                        errors={errors}
                        {...item}
                        {...field}
                        onChange={(e: any) => {
                          // if (!isNaN(e.target.value))
                          //   searchData[item.name](e.target.value);

                          setSearchData((prev: any) => ({
                            ...prev,
                            [item.name]: e.target.value,
                          }));
                        }}
                        value={(searchData as any)[item.name] ?? ""}
                        placeholder={`جستجو بر اساس ${item.label}`}
                      />
                    );
                  }}
                />
              </Grid>
            ))}
          </Grid>
          <Grid item md={3} display={"flex"} justifyContent={"flex-end"}>
            <Button
              endIcon={<Search />}
              variant="contained"
              sx={{ height: "100%" }}
              onClick={() => {
                // setFilters((prev: any) => ({
                //   ...prev,
                //   name: searchData?.typeName,
                //   className: searchData?.className,
                // }));
                handleSearch();
              }}
            >
              جستجو
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default SearchPannel;
