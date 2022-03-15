export function capitalize(string) {
  return string
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function arrayAfterPop(array) {
  array.pop();
  return array;
}

export function arrayAfterPush(array, item) {
  array.push(item);
  return array;
}

export function arrayAfterSplice(array, index) {
  array.splice(index, 1);
  return array;
}

export function findIndexOfObjectInarray(array, objectProperty, searchKey) {
  return array.findIndex((element) => element[objectProperty] === searchKey);
}
