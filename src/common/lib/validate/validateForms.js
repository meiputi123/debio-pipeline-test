export default {
  data: () => ({ formErrors: [], errorMessages: null, isDirty: {} }),
  
  computed: {
    computeError() {
      const error = this.formErrors.some(error => error?.status === true)

      this.$emit("hasFormErrors", error)

      return error
    }
  },

  created() {
    this.clearState()
  },

  methods: {
    handleError(name, val) {
      this.formErrors = this.formErrors?.filter(error => error.name !== name)

      this.formErrors.push({ name: name, status: val })
    },

    _resetForms(field) {
      Object.entries(this.isDirty[field]).forEach(([key]) => {
        this.isDirty[field][key] = null
      })
    },

    _touchForms(field) {
      const computeErrors = (objectKey, objectValue, parentKey) => {
        const context = this

        return objectValue.reduce((filtered, rule) => {
          const isError = rule.call(
            this,
            parentKey ? context._data[parentKey][objectKey] : context._data[objectKey]
          )

          if (typeof isError !== "boolean") filtered.push({ message: isError })

          return filtered
        }, [])
      }

      if (field) {
        const selectedField = this.$options.rules[field]

        Object.entries(selectedField).forEach(([key, value]) => {
          this.isDirty = {
            ...this.isDirty,
            [field]: {
              ...(
                this.isDirty
                  ? this.isDirty[field]
                  : null
              ),
              [key]: Boolean(computeErrors(key, value, field)?.length)
            }
          }
        })

        return
      }

      Object.entries(this.$options.rules).forEach(([key, parentValue]) => {
        if (key === "isDirty") return

        if (Array.isArray(parentValue)) {
          this.isDirty = {
            ...this.isDirty,
            [key]: Boolean(computeErrors(key, parentValue)?.length)
          }

          return
        }

        Object.entries(parentValue).forEach(([childKey, value]) => {
          this.isDirty = {
            ...this.isDirty,
            [key]: {
              ...this.isDirty[key],
              [childKey]: Boolean(computeErrors(childKey, value, key)?.length)
            }
          }
        })
      })
    },

    clearState() {
      Object.entries(this.$options.rules).forEach(([key, parentValue]) => {
        if (key === "isDirty") return

        if (Array.isArray(parentValue)) {
          this.isDirty = {
            ...this.isDirty,
            [key]: null
          }

          return
        }

        Object.entries(parentValue).forEach(([childKey]) => {
          this.isDirty = {
            ...this.isDirty,
            [key]: {
              ...this.isDirty[key],
              [childKey]: null
            }
          }
        })
      })
    }
  }
}
