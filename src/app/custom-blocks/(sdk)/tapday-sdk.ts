import { CustomBlockProductType } from '../types'

class TadpaySdk {
  public data = {} as CustomBlockProductType
  constructor(data: CustomBlockProductType) {
    this.data = data
  }
}

export { TadpaySdk }
