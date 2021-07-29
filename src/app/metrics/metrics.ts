

export function mcc(tp, tn, fp, fn){
  let mcc = (tp * tn) - (fp * fn);
  let div = Math.sqrt((tp + fp)*(tp + fn)*(tn + fp)*(tn + fn));
  return mcc / (div > 0 ? div : 1);
}

export function precision(tp, tn, fp, fn){
  return tp / (tp + fp);
}

export function recall(tp, tn, fp, fn){
  return tp / (tp + fn);
}

export function bac(tp, tn, fp, fn){
  return ((tp / (tp + fn))+(tn /(tn + fp)))* 0.5;
}

export function acc(tp, tn, fp, fn){
  return (tp + tn)/(tp + fn + tn + fp);
}

export const CALC_FUNCTIONS = {
  'mcc': mcc,
  'precision': precision,
  'recall': recall,
  'bac': bac,
  'acc': acc
}
