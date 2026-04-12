import { FormGroup } from '@angular/forms';

export class FormErrorUtil {

  static applyBackendErrors(form: FormGroup, error: any) {
    const backendErrors = error?.error?.errors;

    if (!backendErrors) return;

    Object.keys(backendErrors).forEach(field => {
      const control = form.get(field);

      if (control) {
        control.setErrors({
          ...control.errors,
          backend: backendErrors[field]
        });

        control.markAsTouched();
      }
    });
  }

  static clearBackendErrors(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);

      if (control?.hasError('backend')) {
        const errors = { ...control.errors };
        delete errors['backend'];

        control.setErrors(Object.keys(errors).length ? errors : null);
      }
    });
  }
}