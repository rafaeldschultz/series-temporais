import AC from  "../assets/geoJsons/AC.json"
import AL from  "../assets/geoJsons/AL.json"
import AM from  "../assets/geoJsons/AM.json"
import AP from  "../assets/geoJsons/AP.json"
import BA from  "../assets/geoJsons/BA.json"
import CE from  "../assets/geoJsons/CE.json"
import DF from  "../assets/geoJsons/DF.json"
import ES from  "../assets/geoJsons/ES.json"
import GO from  "../assets/geoJsons/GO.json"
import MA from  "../assets/geoJsons/MA.json"
import MG from  "../assets/geoJsons/MG.json"
import MS from  "../assets/geoJsons/MS.json"
import MT from  "../assets/geoJsons/MT.json"
import PA from  "../assets/geoJsons/PA.json"
import PB from  "../assets/geoJsons/PB.json"
import PE from  "../assets/geoJsons/PE.json"
import PI from  "../assets/geoJsons/PI.json"
import PR from  "../assets/geoJsons/PR.json"
import RJ from  "../assets/geoJsons/RJ.json"
import RN from  "../assets/geoJsons/RN.json"
import RO from  "../assets/geoJsons/RO.json"
import RR from  "../assets/geoJsons/RR.json"
import RS from  "../assets/geoJsons/RS.json"
import SC from  "../assets/geoJsons/SC.json"
import SE from  "../assets/geoJsons/SE.json"
import SP from  "../assets/geoJsons/SP.json"
import brasil from  "../assets/geoJsons/brasil.json"


const selectMap = (state) => {
  console.log(state)
  
  if (state == "AC")          return  AC
  else if (state == "AL")     return  AL
  else if (state == "AM")     return  AM
  else if (state == "AP")     return  AP
  else if (state == "BA")     return  BA
  else if (state == "CE")     return  CE
  else if (state == "DF")     return  DF
  else if (state == "ES")     return  ES
  else if (state == "GO")     return  GO
  else if (state == "MA")     return  MA
  else if (state == "MG")     return  MG
  else if (state == "MS")     return  MS
  else if (state == "MT")     return  MT
  else if (state == "PA")     return  PA
  else if (state == "PB")     return  PB
  else if (state == "PE")     return  PE
  else if (state == "PI")     return  PI
  else if (state == "PR")     return  PR
  else if (state == "RJ")     return  RJ
  else if (state == "RN")     return  RN
  else if (state == "RO")     return  RO
  else if (state == "RR")     return  RR
  else if (state == "RS")     return  RS
  else if (state == "SC")     return  SC
  else if (state == "SE")     return  SE
  else if (state == "SP")     return  SP

  return brasil
}  

export default selectMap