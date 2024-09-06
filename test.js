const destructValue = (lambda) => {
  if (typeof lambda === "function") {
    return lambda()
  } 

  return lambda;
}