import { FormControl, ValidationErrors } from '@angular/forms';

export function codeMeliValidator(
  control: FormControl
): ValidationErrors | null {
  const code = control.value;

  if (code == null || code === '') {
    return { require: true };
  }

  if (!checkCodeMeli(code)) return { codeMeliValidator: true };
  return null;
}

function checkCodeMeli(code: string): boolean {
  const L: number = code.length;

  if (L < 8 || parseInt(code, 10) === 0) return false;
  code = ('0000' + code).substr(L + 4 - 10);
  if (parseInt(code.substr(3, 6), 10) === 0) return false;
  const c: number = parseInt(code.substr(9, 1), 10);
  let s: number = 0;
  for (let i = 0; i < 9; i++) s += parseInt(code.substr(i, 1), 10) * (10 - i);
  s = s % 11;
  return (s < 2 && c === s) || (s >= 2 && c === 11 - s);
}
