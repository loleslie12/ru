import React, {useId} from 'react';
import {LockKeyhole} from 'lucide-react';
export default function PermissionButton({allowed, children, onClick, className, action, onDenied, disabled=false}) {
 const id=useId();
 if(disabled || allowed) return <button type="button" disabled={disabled} className={className} onClick={onClick}>{children}</button>;
 const message=`You do not have permission to do this. Your account cannot ${action}. Contact your administrator to request access.`;
 return <span className="permission-control"><button type="button" className={className} aria-disabled="true" aria-describedby={id} onClick={()=>onDenied?.(message)}>{children}<LockKeyhole size={13}/></button><span id={id} className="permission-tooltip" role="tooltip">You do not have permission to {action}.</span></span>;
}
