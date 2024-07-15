export function formatPrice(price) {
  return price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}

export function formatEmail(
  name,
  inst,
  plano,
  salGroup,
  titAgeGroup,
  benefsAgeGroup,
  agregsAgeGroup,
  grossContrib,
  assistTotal,
  liqPrevAgregContrib,
  agregsContrib,
  liqContrib
) {
  let body = `<p>Prezado(a) <b>${name}</b>, segue a simulação do plano de saúde solicitada:</p>
    <br />
    <p>Instituição: ${inst}</p>
    <p>Plano: ${plano}</p>
    <p>Faixa salarial do titular (valor bruto): ${salGroup}</p>
    <p>Faixa etária do titular: ${titAgeGroup}</p>`


  if (benefsAgeGroup.length > 1) {
    benefsAgeGroup.splice(0, 1)

    for (let i = 0; i < benefsAgeGroup.length; i++) {
      body = body +
        `<p>Faixa etária do dependente ${i + 1}: ${benefsAgeGroup[i]}</p>`
    }
  }

  if (agregsAgeGroup.length > 1) {
    agregsAgeGroup.splice(0, 1)
    for (let i = 0; i < agregsAgeGroup.length; i++) {
      body = body +
        `<p>Faixa etária do agregado ${i + 1}: ${agregsAgeGroup[i]}</p>`
    }
  }

  body = body +
    `<br />
    <p>Valor da contribuição bruta do grupo familiar: ${formatPrice(grossContrib)}</p>
    <p>Auxílio-saúde do grupo familiar: ${formatPrice(assistTotal)}</p>
    <p>Valor a ser pago pelo grupo familiar: ${formatPrice(liqPrevAgregContrib)}</p>`

  for (let i = 0; i < agregsContrib.length; i++) {
    body = body +
      `<p>Valor da contribuição a ser pago pelo agregado ${i + 1}: ${formatPrice(agregsContrib[i])}</p>`
  }

  body = body + `<p>Valor total a ser pago: ${formatPrice(liqContrib)}</p>`

  body = body +
    `<br />
    <p>Plano de Saúde do Agros: o cuidado que você e sua família merecem!</p>
    <p>Para saber mais sobre o plano de saúde, esclarecer dúvidas ou solicitar sua adesão, entre em contato conosco! https://www.agros.org.br/fale-com-o-agros</p>
    <p>Responda a este e-mail para saber mais sobre o plano de saúde, esclarecer dúvidas ou solicitar sua adesão. Estamos à disposição para atendê-lo!</p>`
  
  return body;
}