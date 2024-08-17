import { useState, useEffect } from "react";
import { useNavigate, useParams } from "@remix-run/react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import { TextField, Page, Layout, Select, Card } from "@shopify/polaris";
import { setupAxiosInterceptors } from "@/lib/axios-api-instance";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createLoyaltyEvent,
  updateLoyaltyEvent,
} from "@/store/event/eventSlice";
import { getAllLoyaltyTiers } from "@/store/tier/tierSlice";

const LoyaltyEventForm = ({
  eventData,
  isUpdate,
}: {
  eventData?: any;
  isUpdate: boolean;
}) => {
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tiers = useAppSelector((state) => state.tier.loyaltyTiers);
  const _eventType = useAppSelector((state) => state.event.selectedEvent);
  const eventType = isUpdate ? eventData?.event : _eventType;
  const [spendingType, setSpendingType] = useState<string>(
    eventData?.spendingType,
  );
  const [pointsType, setPointsType] = useState<string>(eventData?.type);
  const tierOptions = tiers?.map((tier: any) => ({
    label: tier.name,
    value: tier.id,
  }));

  console.log("eventType", eventData, eventType);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedConfig = JSON.parse(
        sessionStorage.getItem("app-bridge-config") || "{}",
      );
      const { host } = storedConfig;
      setupAxiosInterceptors(host);
      dispatch(getAllLoyaltyTiers());
    }
  }, [submitted]);

  const getValidationSchema = () => {
    let schema: any = {
      points: Yup.number()
        .required("Points are required")
        .min(0, "Points must be non-negative"),
      type: Yup.string().required("Event type is required"),
      tierId: Yup.string().required("Tier is required"),
    };

    if (eventType !== "SIGN_UP") {
      schema = {
        ...schema,
        minOrderValue: Yup.number()
          .required("Minimum order value is required")
          .min(0, "Minimum order value must be non-negative"),
        // maxOrderValue: Yup.number()
        //   .required("Maximum order value is required")
        //   .min(0, "Maximum order value must be non-negative"),

        spendingType: Yup.string().required("Spending type is required"),
      };
    }
    if (pointsType === "CREDIT") {
      schema = {
        ...schema,
        expiresInDays: Yup.number().required("Days is required"),
      };
    }

    if (spendingType === "PERCENTAGE" && pointsType === "CREDIT") {
      schema = {
        ...schema,
        spendingLimit: Yup.number()
          .required("Spending limit is required")
          .min(0, "Spending limit must be non-negative"),
      };
    }

    if (spendingType === "PERCENTAGE") {
      schema = {
        ...schema,
        points: Yup.number()
          .required("Points are required")
          .min(0, "Points must be non-negative")
          .max(100, "Points must be less than or equal to 100"),
      };
    }
    return Yup.object(schema);
  };

  const { eventId } = useParams();
  console.log("eventData", eventData);

  const submitEventData = async (values: any) => {
    try {
      setSubmitted(true);
      if (isUpdate) {
        const { minOrderValue, points, spendingLimit, expiresInDays } = values;
        const valuesToSend = {
          ...values,
          event: eventData.event,
          points: parseInt(points),
          expiresInDays: values.expiresInDays,
        };

        if (minOrderValue) {
          valuesToSend.minOrderValue = parseInt(minOrderValue);
        }
        valuesToSend.maxOrderValue = 0;

        if (spendingLimit) {
          valuesToSend.spendingLimit = parseInt(spendingLimit);
        }

        if (!expiresInDays || pointsType === "DEBIT") {
          valuesToSend.expiresInDays = 0;
        }

        const { id, ...restValues } = valuesToSend;
        await dispatch(
          updateLoyaltyEvent({ id: eventId, loyaltyEventData: restValues }),
        );
      } else {
        const { minOrderValue, points, spendingLimit, expiresInDays } = values;

        const valuesToSend = {
          ...values,
          event: eventType,
          points: parseInt(points),
          expiresInDays: values.expiresInDays,
        };

        if (!expiresInDays || pointsType === "DEBIT") {
          valuesToSend.expiresInDays = 0;
        }

        if (minOrderValue) {
          valuesToSend.minOrderValue = parseInt(minOrderValue);
        }
        valuesToSend.maxOrderValue = 0;

        if (spendingLimit) {
          valuesToSend.spendingLimit = parseInt(spendingLimit);
        }

        await dispatch(createLoyaltyEvent(valuesToSend));
      }
      navigate("/dashboard/events");
    } catch (error) {
      console.error("Error submitting event data:", error);
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <Formik
      initialValues={{
        points: eventData?.points + 0 || 0,
        expiresInDays: eventData?.expiresInDays || "",
        minOrderValue: eventData?.minOrderValue || null,
        maxOrderValue: eventData?.maxOrderValue || null,
        spendingLimit: eventData?.spendingLimit || null,
        spendingType: eventData?.spendingType || "",
        tierId: eventData?.tierId || "",
        type: eventData?.type || "",
      }}
      validationSchema={getValidationSchema()}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        submitEventData(values).then(() => {
          setSubmitting(false);
          resetForm();
        });
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <FormikForm>
          <Page
            title={eventType === "SIGN_UP" ? "Sign Up" : "Order Create"}
            fullWidth
            primaryAction={{
              content: isUpdate ? "Save Event" : "Create Event",
              onAction: handleSubmit,
              loading: isSubmitting,
            }}
          >
            <Layout>
              <Layout.Section>
                <Card>
                  <div className="py-3">
                    <div className="grid grid-cols-4 gap-3 items-end">
                      <div className="col-span-2">
                        <Select
                          label="Tier"
                          name="tierId"
                          placeholder="Select Tier"
                          options={tierOptions}
                          value={values.tierId}
                          onChange={(value) =>
                            handleChange({
                              target: { name: "tierId", value: value },
                            })
                          }
                          error={touched.tierId && (errors.tierId as string)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Select
                          label="Type"
                          name="type"
                          placeholder="Select an option"
                          options={[
                            { label: "Credit", value: "CREDIT" },
                            { label: "Debit", value: "DEBIT" },
                          ]}
                          value={values.type}
                          onChange={(value) => {
                            setPointsType(value);
                            handleChange({
                              target: { name: "type", value: value },
                            });
                          }}
                          error={touched.type && (errors.type as string)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 items-end mt-5">
                      <div className="col-span-2">
                        <TextField
                          label="Value (Fixed or Percentage)"
                          type="number"
                          name="points"
                          value={values.points}
                          onChange={(value) => {
                            handleChange({
                              target: { name: "points", value: value },
                            });
                          }}
                          onBlur={handleBlur}
                          error={touched.points && (errors.points as string)}
                          autoComplete="on"
                        />
                      </div>
                      {pointsType === "CREDIT" && (
                        <div className="col-span-2">
                          <TextField
                            label="Expiry In Days"
                            type="number"
                            name="expiresInDays"
                            value={values.expiresInDays}
                            onChange={(value) => {
                              handleChange({
                                target: { name: "expiresInDays", value: value },
                              });
                            }}
                            min={new Date().toISOString().split("T")[0]}
                            autoComplete="on"
                            onBlur={handleBlur}
                            error={
                              touched.expiresInDays && errors.expiresInDays
                            }
                          />
                        </div>
                      )}
                    </div>

                    {eventType !== "SIGN_UP" && (
                      <>
                        <div className="grid grid-cols-4 gap-3 items-end mt-5">
                          <div className="col-span-2">
                            <TextField
                              label="Minimum Order Value"
                              type="number"
                              name="minOrderValue"
                              value={values.minOrderValue}
                              autoComplete="on"
                              onChange={(value) => {
                                console.log("value", value);
                                handleChange({
                                  target: {
                                    name: "minOrderValue",
                                    value: value,
                                  },
                                });
                              }}
                              onBlur={handleBlur}
                              error={
                                touched.minOrderValue &&
                                (errors.minOrderValue as string)
                              }
                            />
                          </div>
                          {/* <div className="col-span-2">
                            <TextField
                              label="Maximum Order Value"
                              type="number"
                              autoComplete="on"
                              name="maxOrderValue"
                              value={values.maxOrderValue}
                              onChange={(value) => {
                                console.log("value", value);
                                handleChange({
                                  target: {
                                    name: "maxOrderValue",
                                    value: value,
                                  },
                                });
                              }}
                              onBlur={handleBlur}
                              error={
                                touched.maxOrderValue &&
                                (errors.maxOrderValue as string)
                              }
                            />
                          </div> */}
                        </div>
                        <div className="grid grid-cols-4 gap-3 items-end mt-5">
                          <div className="col-span-2">
                            <Select
                              label="Spending Type"
                              name="spendingType"
                              placeholder="Select Type"
                              options={[
                                { label: "Fixed", value: "FIXED" },
                                { label: "Percentage", value: "PERCENTAGE" },
                              ]}
                              value={values.spendingType}
                              onChange={(value) => {
                                setSpendingType(value);
                                handleChange({
                                  target: {
                                    name: "spendingType",
                                    value: value,
                                  },
                                });
                              }}
                              error={
                                touched.spendingType &&
                                (errors.spendingType as string)
                              }
                            />
                          </div>
                          {spendingType === "PERCENTAGE" &&
                            pointsType === "CREDIT" && (
                              <div className="col-span-2">
                                <TextField
                                  label="Spending Limit"
                                  autoComplete="on"
                                  type="number"
                                  name="spendingLimit"
                                  value={values.spendingLimit}
                                  onChange={(value) =>
                                    handleChange({
                                      target: {
                                        name: "spendingLimit",
                                        value: value,
                                      },
                                    })
                                  }
                                  onBlur={handleBlur}
                                  error={
                                    touched.spendingLimit &&
                                    (errors.spendingLimit as string)
                                  }
                                />
                              </div>
                            )}
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </Layout.Section>
            </Layout>
          </Page>
        </FormikForm>
      )}
    </Formik>
  );
};

export default LoyaltyEventForm;
