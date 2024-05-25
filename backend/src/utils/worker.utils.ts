// export const worker = await define({
//   add(x: number, y: number) {
//     return x + y;
//   },
//   async waitThenAdd(x: number, y: number) {
//     await new Promise((resolve) => setTimeout(resolve, 5e3));
//     return x + y;
//   },
//   // Functions don't have to be directly defined within the
//   // object, they can be defined elsewhere outside, or even
//   // imported from a totally different module.
//   subtract,
// });
