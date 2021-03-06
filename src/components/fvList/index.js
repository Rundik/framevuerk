import locale from 'locale'
import utility from '../../utility'
import template from './template.pug'
import style from './style.scss'
/* global process */

export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    expanded: {
      type: Boolean,
      default: false
    },
    searchQuery: {
      type: String,
      default: ''
    },
    selected: {
      default: undefined
    },
    param: {
      default: null
    },
    getFocus: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      highlightedOption: this.items.length ? 0 : null,
      focused: false,
      notFoundText: locale.notFound()
    }
  },
  computed: {
    pItems () {
      return this.items.filter(this.equalSearch)
    }
  },
  methods: {
    clickItem (item, index) {
      if (!item.disabled) {
        this.$emit('click-item', item, this.param)
        if (typeof item.action === 'function') {
          item.action(this.param)
        }
      }
    },
    isSelected (item) {
      const value = typeof item.value !== 'undefined' ? item.value : item || ''
      if (item.selected) {
        return true
      }
      if (typeof this.selected === 'undefined' || this.selected === null) {
        return false
      } else {
        if (this.selected.constructor === Array) {
          return this.selected.indexOf(value) !== -1
        } else {
          return this.selected === value
        }
      }
    },
    keydown (event) {
      if (event.target !== this.$el && this.getFocus !== false) {
        return
      }
      switch (event.which) {
      case 38: // up
        this.highlightedOption = this.highlightedOption == null ? this.pItems.length : this.highlightedOption
        this.highlightedOption = this.highlightedOption - 1 < 0 ? this.pItems.length - 1 : this.highlightedOption - 1
        break
      case 40: // down
        this.highlightedOption = this.highlightedOption == null ? -1 : this.highlightedOption
        this.highlightedOption = this.highlightedOption + 1 >= this.pItems.length ? 0 : this.highlightedOption + 1
        break
      case process.env.DIRECTION === 'ltr' ? 37 : 39: // 37: left, 39: right,
        if (this.highlightedOption !== null) {
          this.$refs.pItems[this.highlightedOption].collapse()
        }
        break
      case process.env.DIRECTION === 'ltr' ? 39 : 37: // 37: left, 39: right,
        if (this.highlightedOption !== null) {
          this.$refs.pItems[this.highlightedOption].expand()
        }
        break
      case 13: // enter
        event.preventDefault()
        if (this.highlightedOption !== null) {
          this.clickItem(this.pItems[ this.highlightedOption ], this.highlightedOption)
        }
        break
      }
    },
    equalSearch (item) {
      const pItem = {
        text: item.text || item || '',
        value: item.value || item || ''
      }
      if (!this.searchQuery ||
        utility.contains(pItem.text, this.searchQuery) ||
        utility.contains(pItem.value, this.searchQuery)) {
        return true
      } else {
        return false
      }
    }
  },
  style,
  render: template.render
}
