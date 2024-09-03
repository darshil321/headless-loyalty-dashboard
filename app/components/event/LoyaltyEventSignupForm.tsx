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

const LoyaltyEventSignUpForm = ({
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

  const [pointsType, setPointsType] = useState<string>(eventData?.type);
  const tierOptions = tiers?.map((tier: any) => ({
    label: tier.name,
    value: tier.id,
  }));

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedConfig = JSON.parse(
        sessionStorage.getItem("app-bridge-config") || "{}",
      );
      const { host } = storedConfig;
      setupAxiosInterceptors(host);
      dispatch(getAllLoyaltyTiers());
    }
  }, [submitted, dispatch, tiers]);

  const getValidationSchema = () => {
    let schema: any = {
      points: Yup.number()
        .required("Points are required")
        .min(0, "Points must be non-negative"),
      type: Yup.string().required("Event type is required"),
      tierId: Yup.string().required("Tier is required"),
      status: Yup.string().required("Status is required"),
    };

    if (pointsType === "CREDIT") {
      schema = {
        ...schema,
        expiresInDays: Yup.number().required("Days is required"),
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
          minOrderValue: 0,
          maxOrderValue: 0,
        };

        if (!expiresInDays || pointsType === "DEBIT") {
          valuesToSend.expiresInDays = 0;
        }

        if (minOrderValue) {
          valuesToSend.minOrderValue = parseInt(minOrderValue);
        }

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
        status: eventData?.status || "ACTIVE",
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
            title={"Sign Up"}
            fullWidth
            primaryAction={{
              content: isUpdate ? "Save Event" : "Create Event",
              onAction: handleSubmit,
              loading: isSubmitting,
            }}
            backAction={{
              onAction: () => navigate("/dashboard/events"),
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
                              touched.expiresInDays &&
                              (errors.expiresInDays as string)
                            }
                          />
                        </div>
                      )}
                    </div>

                    <div className="mt-5">
                      <Select
                        label="Status"
                        name="status"
                        placeholder="Select status"
                        options={[
                          { label: "Inactive", value: "INACTIVE" },
                          { label: "Active", value: "ACTIVE" },
                        ]}
                        value={values.status}
                        onChange={(value) => {
                          handleChange({
                            target: { name: "status", value: value },
                          });
                        }}
                        error={touched.status && (errors.status as string)}
                      />
                    </div>
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

export default LoyaltyEventSignUpForm;
