import { useQuery } from 'react-query'

const EMPTY_CX = []

const getDrugs = async <T>(
  _ : any,
  serverUrl: string,
  genes: string
) => {
  return await fetch('https://raw.githubusercontent.com/dotasek/drugcell-analysis-webapp/master/public/a549_drugs_sorted.tsv')
}

export default function useDrugs(
  serverUrl: string,
  genes: string
) {
  return useQuery(['drugs', serverUrl, genes], getDrugs)
}
