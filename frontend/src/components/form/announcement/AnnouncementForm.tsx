import { useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import { TFunction } from "i18next";
import { createValidationSchema } from "./validationSchema";
import FormikTextField from "src/components/form/FormikTextField";
import MultiAutocomplete from "src/components/selects/MultiAutocomplete";
import { ANNOUNCEMENT_BODY_ROWS } from "./config/announcement.config";
import { PUBLICATION_DATE_FORMAT } from "src/config/date.config";
import { useCategories } from "src/hooks/categories/useCategories";
import { FormActionsStyled } from "src/styles/customStyledComponent";
import { commonStyles, globalStyles } from "src/styles/globalStyles";
import { AnnouncementType } from "src/types/announcement";
import { AnnouncementFormValues } from "./types/announcementForm";
import { mapAnnouncementToFormValues } from "src/components/form/announcement/utils/announcementFormValues";

interface AnnouncementFormProps {
  announcement?: AnnouncementType;
  isSaving: boolean;
  t: TFunction;
  onSubmit: (values: AnnouncementFormValues) => void;
}

const AnnouncementForm = ({
  announcement,
  isSaving,
  t,
  onSubmit,
}: AnnouncementFormProps) => {
  const { categoryOptions, isLoading: isLoadingCategories } = useCategories();

  const initialValues = useMemo(
    () => mapAnnouncementToFormValues(announcement),
    [announcement],
  );

  const validationSchema = useMemo(() => createValidationSchema(t), [t]);

  const formik = useFormik<AnnouncementFormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: false,
    onSubmit,
  });

  const handlePublishClick = useCallback(async () => {
    const errors = await formik.validateForm();

    if (Object.keys(errors).length > 0) {
      formik.setTouched({
        title: true,
        body: true,
        categoryIds: true,
        publicationDate: true,
      });

      return;
    }

    formik.handleSubmit();
  }, [formik]);

  const handleTitleChange = useCallback(
    (value: string) => formik.setFieldValue("title", value),
    [formik],
  );

  const handleBodyChange = useCallback(
    (value: string) => formik.setFieldValue("body", value),
    [formik],
  );

  const handlePublicationDateChange = useCallback(
    (value: string) => formik.setFieldValue("publicationDate", value),
    [formik],
  );

  const handleCategoryChange = useCallback(
    (selectedIds: number[]) => formik.setFieldValue("categoryIds", selectedIds),
    [formik],
  );

  return (
    <Box sx={globalStyles.formWrapper}>
      <FormikTextField
        name="title"
        label={t("announcements.form.title")}
        value={formik.values.title}
        onChange={handleTitleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
        required
      />

      <FormikTextField
        name="body"
        label={t("announcements.form.body")}
        value={formik.values.body}
        onChange={handleBodyChange}
        onBlur={formik.handleBlur}
        error={formik.touched.body && Boolean(formik.errors.body)}
        helperText={formik.touched.body && formik.errors.body}
        multiline
        rows={ANNOUNCEMENT_BODY_ROWS}
        required
      />

      <Box sx={{ ...commonStyles.flexColumn, ...commonStyles.gap8px }}>
        <Box>
          <Typography variant="subtitle1">
            {t("announcements.form.category")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("announcements.form.categoryHint")}
          </Typography>
        </Box>
        <MultiAutocomplete
          name="categoryIds"
          ariaLabel={t("announcements.form.category")}
          items={categoryOptions}
          values={formik.values.categoryIds}
          handleChange={handleCategoryChange}
          onBlur={formik.handleBlur}
          noOptionsText={t("general.noResults")}
          placeholder={t("announcements.form.categoryPlaceholder")}
          disabled={isLoadingCategories}
          error={
            formik.touched.categoryIds && Boolean(formik.errors.categoryIds)
          }
          helperText={
            formik.touched.categoryIds &&
            (formik.errors.categoryIds as string | undefined)
          }
        />
      </Box>

      <Box sx={{ ...commonStyles.flexColumn, ...commonStyles.gap8px }}>
        <Typography variant="subtitle1">
          {t("announcements.form.publicationDate")}
        </Typography>
        <FormikTextField
          name="publicationDate"
          value={formik.values.publicationDate}
          onChange={handlePublicationDateChange}
          onBlur={formik.handleBlur}
          placeholder={PUBLICATION_DATE_FORMAT}
          error={
            formik.touched.publicationDate &&
            Boolean(formik.errors.publicationDate)
          }
          helperText={
            formik.touched.publicationDate && formik.errors.publicationDate
          }
          required
        />
      </Box>

      <FormActionsStyled>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePublishClick}
          disabled={isSaving || !formik.dirty}
        >
          {t("announcements.form.publish")}
        </Button>
      </FormActionsStyled>
    </Box>
  );
};

export default AnnouncementForm;
