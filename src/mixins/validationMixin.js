import { Validator } from 'vee-validate'

const validationMixin = {
  methods: {
    validationClasses (field) {
      var classes = {}

      if (this.errors) {
        classes.valid = !this.errors.has(field)
        classes.invalid = this.errors.has(field)
      }

      if (this.fields) {
        var flags = this.fields[field]
        for (var f in flags) {
          classes[f] = flags[f]
        }
      }

      if (!this.isEmpty(field)) {
        classes.touched = true
      }

      return classes
    },

    isTouched (field) {
      return !this.isEmpty(field) || (this.fields && this.fields[field] && this.fields[field].touched)
    },

    isEmpty (field) {
      return this[field] === null || this[field] === undefined || this[field] === ''
    },

    touch (field) {
      if (!this.fields || !this.fields[field]) {
        return
      }

      this.$validator.fields.find({ name: field }).setFlags({ touched: true })
    },

    setDirty (field) {
      if (!this.fields || !this.fields[field]) {
        return
      }

      this.$validator.fields.find({ name: field }).setFlags({ dirty: true })
    },

    touchAll () {
      if (!this.fields) {
        return
      }

      for (var item in this.fields) {
        this.touch(this.fields[item])
      }
    },

    collectLongErrorMessageKeys () {
      var self = this
      return [...new Set(this.$validator.fields.items.filter(field => !field.flags.valid).map(field => `validation.long_messages.${self.$options.name}.${field.name}.${self.errors.firstRule(field.name)}`))]
    }
  },

  created () {
    emailValidator(Validator)
    // passwordValidator(Validator)
  },

  beforeDestroy () {
    this.$validator.pause()
  }
}

export default validationMixin

function emailValidator (value, args) {
  const validEmail = (value, args) => {
    return /\S+@\S+\.\S+/.test(value)
  }
  Validator.extend('validEmail', validEmail)
}

// function passwordValidator (value, args) {
//   const validPassword = (value, args) => {
//     return (/[a-z]/.test(value) && /[A-Z]/.test(value) && value.length >= 8)
//   }
//   Validator.extend('validPassword', validPassword)
// }
