// composable math functions
function sum(a, b) {
  return a + b
}
// section: #other-methods
function product(a, b) {
  return a * b
}
function square(a) {
  return product(a, a)
 }

function cube(a) {
  return product(a, square(a))
 }
// section: export default = {sum, product, square, cube}
#exports