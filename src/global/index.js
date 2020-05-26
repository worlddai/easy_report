class Global {

    constructor() {
        this._data_map = new Map();
    }
    setConfig(id, obj) {
        this._data_map.set(id, obj);
    }
    removeConfig(id)
    {
      return this._data_map.delete(id);
    }
    getContainerWidth(id) {
        const o = this._data_map.get(id);
        if (!o)
            return null
        return o.width
    }
    getContainerHeight() {
        const o = this._data_map.get(id);
        if (!o)
            return null
        return o.height
    }
}

export default new Global();