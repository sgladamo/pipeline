function escapeRegExp(value: string): string {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export function requestSearch(searchValue: string, object: any) {
  const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
  return Object.values(object).some((value: any) => {
    return value ? searchRegex.test(value.toString()) : false;
  });
}
