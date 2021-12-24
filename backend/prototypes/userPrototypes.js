const userPrototype = {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
          unique: true,
        },
        password: {
          type: String,
          required: true,
        },
        isAdmin: {
          type: Boolean,
          required: true,
          default: false,
        },
        pools: {type: Array}
}
      
export {userPrototype}