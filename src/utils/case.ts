import {capitalCase} from 'change-case';
export function myTitleCase(val: string) {
  // return titleCase(sentenceCase(val));
  return capitalCase(val);
}

export function conditionalTitleCase(val: string) {
  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (format.test(val)) {
    return val;
  } else {
    return capitalCase(val);
  }
}
