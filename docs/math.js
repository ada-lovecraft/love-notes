// composable math functions
function sum(a, b) {
  return a + b
}
function product(a, b) {
  return a * b
}
function square(a) {
  return product(a, a)
}

function cube(a) {
  return product(a, square(a))
}
export default = {sum, product, square, cube}