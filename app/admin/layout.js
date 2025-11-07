 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function AdminLayout({ children }) {
  const c = cookies()
  const ownerCookie = _optionalChain([c, 'access', _ => _.get, 'call', _2 => _2("owner-auth"), 'optionalAccess', _3 => _3.value]) || _optionalChain([c, 'access', _4 => _4.get, 'call', _5 => _5("ownerId"), 'optionalAccess', _6 => _6.value]) || _optionalChain([c, 'access', _7 => _7.get, 'call', _8 => _8("owner_session"), 'optionalAccess', _9 => _9.value])

  if (!ownerCookie) {
    redirect("/owner/login")
  }
  return React.createElement(React.Fragment, null, children)
}
