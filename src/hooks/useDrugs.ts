import { useQuery } from 'react-query'

import * as d3 from 'd3'

const EMPTY_CX = []

const getDrugs = async <T>(
  _ : any,
  serverUrl: string,
  genes: string
) => {
  let data = await d3.tsv('https://raw.githubusercontent.com/dotasek/drugcell-analysis-webapp/master/public/a549_drugs_sorted.tsv')
  data.forEach((d : any) => {
    d.predicted_AUC = parseFloat(d.predicted_AUC)
  })
  return data
}

export default function useDrugs(
  serverUrl: string,
  genes: string
) {
  return useQuery(['drugs', serverUrl, genes], getDrugs)
}
