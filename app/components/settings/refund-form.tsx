import { useEffect, useState } from "react";
import { Formik, Form as FormikForm, FieldArray } from "formik";
import * as Yup from "yup";
import {
  TextField as PolarisTextField,
  Select as PolarisSelect,
  Card,
  Layout,
  Page,
  // Checkbox,
  Modal,
  Button,
  TextContainer,
} from "@shopify/polaris";
import { useAppDispatch } from "@/store/hooks";
import {
  createLoyaltyTier,
  deleteLoyaltyTierBenefit,
  updateLoyaltyTier,
} from "@/store/tier/tierSlice";
import { setupAxiosInterceptors } from "@/lib/axios-api-instance";
import { useNavigate } from "@remix-run/react";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  status: Yup.string().required("Status is required"),
  conversionValue: Yup.number().min(1).required("Conversion value is required"),
  // default: Yup.boolean(),
  rules: Yup.array().of(
    Yup.object({
      ruleType: Yup.string(),
      operator: Yup.string(),
      value: Yup.number(),
    }).test(
      "complete-rule",
      "All fields in the rule must be completed",
      (item: any) => {
        if (!item || Object.values(item).every((x) => !x)) return true; // allow completely empty objects
        return (
          item.ruleType && item.operator && (item.value || item.value === 0)
        ); // ensure all fields are filled
      },
    ),
  ),
  benefits: Yup.array().of(
    Yup.object({
      BenefitType: Yup.string(),
      description: Yup.string(),
      criteria: Yup.string(),
      value: Yup.number(),
    }).test(
      "complete-benefit",
      "All fields in the benefit must be completed",
      (item: any) => {
        if (!item || Object.values(item).every((x) => !x)) return true; // allow completely empty objects
        return (
          item.BenefitType &&
          item.description &&
          item.criteria &&
          (item.value || item.value === 0)
        ); // ensure all fields are filled
      },
    ),
  ),
});

const RefundForm = ({ tierData, actionData, isUpdate }: any) => {
  const [submitted, setSubmitted] = useState(false);
  const [activeModal, setActiveModal] = useState(false);
  const [currentBenefitIndex, setCurrentBenefitIndex] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedConfig = JSON.parse(
        sessionStorage.getItem("app-bridge-config") || "{}",
      );
      const { host } = storedConfig;
      setupAxiosInterceptors(host);
    }
  }, [submitted]);

  const handleModalChange = () => {
    setActiveModal(!activeModal);
  };

  const handleDeleteBenefit = (arrayHelpers: any) => {
    if (currentBenefitIndex !== null) {
      const data = {
        benefitId: tierData.benefits[currentBenefitIndex].id,
        tierId: tierData.id,
      };
      dispatch(deleteLoyaltyTierBenefit(data));
      arrayHelpers.remove(currentBenefitIndex);
      handleModalChange(); // Close modal after deletion
    }
  };

  const openModal = (index: any) => {
    setCurrentBenefitIndex(index);
    handleModalChange();
  };

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const submitTierData = async (values: any) => {
    try {
      setSubmitted(!submitted);
      const conversionValue = parseInt(values.conversionValue, 10) || 0;
      if (isUpdate) {
        const { id, ...restValues } = values;

        const _values = {
          loyaltyTier: { ...restValues, conversionValue },
          id: tierData.id,
        };
        await dispatch(updateLoyaltyTier(_values));
      } else {
        values.default = false;
        values.conversionValue = parseInt(values.conversionValue, 10) || 0;
        await dispatch(createLoyaltyTier(values));
      }
      navigate("/tiers");
    } catch (error: any) {
      console.log("error", error);
    }
  };

  return (
    <Formik
      initialValues={{
        name: tierData?.name || "",
        description: tierData?.description || "",
        status: tierData?.status || "inactive",
        conversionValue: (tierData?.conversionValue as number) || 0,
        // default: tierData?.default || false,
        rules: tierData?.rules || [{ ruleType: "", operator: "", value: "0" }],
        benefits: tierData?.benefits || [
          { BenefitType: "", description: "", criteria: "", value: "0" },
        ],
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        console.log("values", values);

        await submitTierData(values);
        setSubmitting(false);
        resetForm();
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        setFieldValue,
      }) => (
        <FormikForm>
          <Page
            title={"Edit Refund Conditions"}
            primaryAction={{
              content: "Save",
              onAction: handleSubmit,
              loading: isSubmitting,
            }}
            backAction={{
              onAction: () => navigate("/settings"),
            }}
          >
            <Layout>
              <Layout.Section>
                <Card>
                  <div>
                    <PolarisTextField
                      autoComplete="off"
                      label="Name"
                      name="name"
                      value={values.name}
                      onChange={(value) =>
                        handleChange({
                          target: {
                            name: "name",
                            value: value,
                          },
                        })
                      }
                      onBlur={handleBlur}
                      error={touched.name && (errors.name as string)}
                    />
                  </div>
                  <div className="mt-5">
                    <PolarisTextField
                      autoComplete="off"
                      label="Description"
                      multiline={4}
                      name="description"
                      value={values.description}
                      onChange={(value) =>
                        handleChange({
                          target: {
                            name: "description",
                            value: value,
                          },
                        })
                      }
                      onBlur={handleBlur}
                      error={
                        touched.description && (errors.description as string)
                      }
                    />
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

export default RefundForm;
