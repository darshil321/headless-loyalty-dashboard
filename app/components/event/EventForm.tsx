import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { redirect } from "react-router";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createLoyaltyEvent,
  updateLoyaltyEvent,
} from "@/store/event/eventSlice";
import { setupAxiosInterceptors } from "@/lib/axios-api-instance";
import { Form as FormikForm, Formik } from "formik";
import { Card, Layout, Page, Select, TextField } from "@shopify/polaris";

// enum SpendingType {
//   FIXED = "fixed",
//   PERCENTAGE = "percentage",
// }

// interface FormDataState {
//   points: string;
//   expiryDate: string;
//   icon: string;
//   minOrderValue: number;
//   maxOrderValue: number;
//   spendingType: SpendingType;
//   spendingLimit: number;
// }

export default function EventForm({ eventData, actionData, isUpdate }: any) {
  //   // const router = useLocation();
  //   // const selectedEvent = useAppSelector((state) => state["event"].selectedEvent);
  //   // const { id = false } = router.search;
  //   // const dispatch = useAppDispatch();

  //   // const [formData, setFormData] = useState<FormDataState>({
  //   //   points: "",
  //   //   expiryDate: "",
  //   //   icon: "default",
  //   //   minOrderValue: 0,
  //   //   maxOrderValue: 0,
  //   //   spendingType: SpendingType.FIXED,
  //   //   spendingLimit: 0,
  //   // });

  //   // const [iconFile, setIconFile] = useState<File | null>(null);
  //   // const [iconPreview, setIconPreview] = useState<string | null>(null);

  //   // useEffect(() => {
  //   //   if (id) {
  //   //     fetchEventData(id);
  //   //   }
  //   // }, [id]);

  //   // const fetchEventData = async (eventId: string) => {
  //   //   try {
  //   //     const response = await fetch(`/api/events/${eventId}`);
  //   //     const data = await response.json();
  //   //     setFormData(data);
  //   //     if (data.iconUrl) {
  //   //       setIconPreview(data.iconUrl);
  //   //     }
  //   //   } catch (error) {
  //   //     console.error("Error fetching event data:", error);
  //   //   }
  //   // };

  //   // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   //   const { name, value } = e.target;
  //   //   setFormData((prevData) => ({ ...prevData, [name]: value }));
  //   // };

  //   // const handleRadioChange = (value: string) => {
  //   //   setFormData((prevData) => ({ ...prevData, icon: value }));
  //   // };

  //   // const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   //   const file = e.target.files?.[0];
  //   //   if (file) {
  //   //     setIconFile(file);
  //   //     const reader = new FileReader();
  //   //     reader.onloadend = () => {
  //   //       setIconPreview(reader.result as string);
  //   //     };
  //   //     reader.readAsDataURL(file);
  //   //   }
  //   // };

  //   // if (iconFile) {
  //   //   formDataToSend.append("icon", iconFile);
  //   // }

  //   try {
  //     // const response = await fetch(url, {
  //     //   method,
  //     //   body: formDataToSend,
  //     // });
  //     dispatch(setEventStage(StepEnum.SET_EVENT_DATA));
  //     redirect("/events");

  //     // if (response.ok) {
  //     //   setEventStage(StepEnum.LIST_TABLE_STAGE);
  //     // } else {
  //     //   console.error("Error submitting form:", await response.text());
  //     // }
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //   }
  // }

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedConfig = JSON.parse(
        sessionStorage.getItem("app-bridge-config") || "{}",
      );
      const { host } = storedConfig;
      setupAxiosInterceptors(host);
    }
  }, [submitted]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedEvent = useAppSelector((state) => state.event.selectedEvent);

  const submitEventData = async (values: any) => {
    try {
      setSubmitted(!submitted);
      if (isUpdate) {
        const { id, ...restValues } = values;
        const _values = { loyaltyEventData: restValues, id };
        await dispatch(updateLoyaltyEvent(_values)); // Dispatch update action
      } else {
        await dispatch(createLoyaltyEvent(values)); // Dispatch create action
      }
      navigate("/tiers");
    } catch (error: any) {
      console.log("error", error);
    }
  };

  return (
    <div className="p-4">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <ArrowLeftIcon className="h-6 w-6" onClick={() => redirect("/")} />
          <h1 className="text-xl font-semibold capitalize">
            {isUpdate ? "Edit Event" : selectedEvent}
          </h1>
        </div>
      </header>
      <main className="flex flex-col items-center justify-start p-4 space-y-4 md:flex-row md:space-x-8 md:space-y-0">
        <Formik
          initialValues={{
            points: "",
            expiryDate: "",
            minOrderValue: "",
            maxOrderValue: "",
            spendingLimit: "",
            spendingType: "",
            tier: "",
          }}
          // validate={validate}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            console.log("values", values);
            await submitEventData(values);
            setSubmitting(false);
            resetForm();
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            errors,
            touched,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          }) => (
            <FormikForm>
              <Page
                title="Event"
                primaryAction={{
                  content: isUpdate ? "Save Event" : "Create Event",
                  onAction: handleSubmit,
                  loading: isSubmitting,
                }}
              >
                <Layout>
                  <Layout.Section>
                    <Card>
                      <div>
                        <TextField
                          label="Points"
                          type="number"
                          name="points"
                          value={values.points}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                        />
                      </div>
                      <div>
                        <TextField
                          label="Expiry Date"
                          type="date"
                          name="expiryDate"
                          value={values.expiryDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                        />
                      </div>
                      <div>
                        <TextField
                          label="Minimum Order Value"
                          type="tel"
                          name="minOrderValue"
                          value={values.minOrderValue}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                        />
                      </div>
                      <div>
                        <TextField
                          label="Maximum Order Value"
                          type="tel"
                          name="maxOrderValue"
                          value={values.maxOrderValue}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                        />
                      </div>
                      <div>
                        <Select
                          label="Spending Type"
                          name="spendingType"
                          options={[
                            { label: "Select Type", value: "" },
                            { label: "Fixed", value: "FIXED" },
                            { label: "Percentage", value: "PERCENTAGE" },
                          ]}
                          onChange={handleChange}
                          value={values.spendingType}
                        />
                      </div>
                      <div>
                        <TextField
                          label="Spending Limit"
                          type="tel"
                          name="spendingLimit"
                          value={values.spendingLimit}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                        />
                      </div>
                      <div>
                        <Select
                          label="Tiers"
                          name="tier"
                          options={[
                            { label: "Tier 1", value: "tier1" },
                            { label: "Tier 2", value: "tier2" },
                          ]}
                          onChange={handleChange}
                          value={values.tier}
                        />
                      </div>
                    </Card>
                  </Layout.Section>
                </Layout>
              </Page>
            </FormikForm>
          )}
        </Formik>
      </main>
    </div>
  );
}

function ArrowLeftIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

// function DefaultIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
//       <circle cx="8.5" cy="8.5" r="1.5" />
//       <polyline points="21 15 16 10 5 21" />
//     </svg>
//   );
// }

{
  /* <aside className="w-full max-w-xs p-4 space-y-4 border rounded-md">
          <h2 className="text-lg font-semibold">Icon</h2>
          <RadioGroup value={formData.icon} onValueChange={handleRadioChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="default" />
              <Label htmlFor="default">Default</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="upload" id="upload" />
              <Label htmlFor="upload">Upload your own</Label>
            </div>
          </RadioGroup>
          {formData.icon === "upload" && (
            <Input type="file" accept="image/*" onChange={handleIconUpload} />
          )}
          <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center">
            {iconPreview ? (
              <img
                src={iconPreview}
                alt="Icon preview"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <DefaultIcon className="w-16 h-16 text-gray-400" />
            )}
          </div>
        </aside> */
}

/* <form
onSubmit={handleSubmit}
className="w-full max-w-lg p-4 space-y-4 border rounded-md"
>
<div className="space-y-2">
  <Label htmlFor="points">Points</Label>
  <Input
    id="points"
    name="points"
    placeholder="Enter points"
    value={formData.points}
    onChange={handleInputChange}
    type="number"
  />
</div>
<div className="space-y-2">
  <Label htmlFor="expiryDate">Expiry Date</Label>
  <Input
    id="expiryDate"
    name="expiryDate"
    placeholder="Enter expiry date"
    value={formData.expiryDate}
    onChange={handleInputChange}
    type="date"
  />
</div>
<div className="grid grid-cols-2 gap-2">
  <div className="gap-2">
    <Label htmlFor="minimum order value">minimum order value</Label>
    <Input
      type="tel"
      value={formData.minOrderValue}
      onChange={handleInputChange}
      id="minimum-order-value"
      placeholder="Enter minimum order value"
    />
  </div>
  <div className="gap-2">
    <Label htmlFor="maximum order value">maximum order value</Label>
    <Input
      type="tel"
      value={formData.maxOrderValue}
      onChange={handleInputChange}
      id="maximum-order-value"
      placeholder="Enter maximum order value"
    />
  </div>
</div>
<div className="grid grid-cols-2 gap-2">
  <div className="grid gap-2">
    <Label htmlFor="Spending Type">Spending Type</Label>
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
  <div className="grid gap-2">
    <Label htmlFor="spendingLimit">Spending Limit</Label>
    <Input
      type="tel"
      value={formData?.spendingLimit}
      onChange={handleInputChange}
      placeholder="spending limit"
      id="spending-limit"
    />
  </div>
</div>
<div className="grid gap-2">
  <Label htmlFor="field2">Tiers</Label>
  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Tiers" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="tier1">tier 1</SelectItem>
      <SelectItem value="tier2">tier 2</SelectItem>
    </SelectContent>
  </Select>
</div>
<div className="flex justify-between pt-4">
  <Button
    type="button"
    variant="destructive"
    onClick={() => {
      /* Handle delete */
//     }}
//   >
//     Delete
//   </Button>
//   <Button type="submit">
//     {isUpdate ? "Update event" : "Create event"}
//   </Button>
// </div>
// </form> */
