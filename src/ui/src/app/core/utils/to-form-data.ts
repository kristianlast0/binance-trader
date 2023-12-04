export function toFormData<T>(formValue: any) {
  const formData = new FormData();
  if(formValue == null) return formData;
  for (const key of Object.keys(formValue)) {
    let value = formValue[key];
    if (typeof value === "boolean") { value = value ? 1 : 0 }
    formData.append(key, value == null ? "" : value);
  }
  return formData;
}
