const COMMANDS = {
    INSERT_BLOCK_INTO_FILE: 1,
    INSERT_BLOCK_INTO_MDAST: 2
  }

const matchers = {}
matchers.INSERT_BLOCK_INTO_FILE = /^> (\S+)$/
matchers.INSERT_BLOCK_INTO_MDAST = /^<3$/

const LoveNotes = {COMMANDS}




export default LoveNotes
