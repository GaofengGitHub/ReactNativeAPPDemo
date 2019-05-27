import DeviceInfo from 'react-native-device-info';

export const compareVersion = (ov, nv) =>{
    if (!ov || !nv || ov == "" || nv == "") {
        return false;
    }
    var b = false,
        ova = ov.split(".", 4), 
        nva = nv.split(".", 4);
    for (var i = 0; i < ova.length && i < nva.length; i++) { 
        var so = ova[i],
            no = parseInt(so),
            sn = nva[i],
            nn = parseInt(sn);
        if (nn > no || sn.length > so.length) {
            return true;
        } else if (nn < no) {
            return false;
        }
    }
    if (nva.length > ova.length && 0 == nv.indexOf(ov)) {
        return true;
    }
}

export const getNowVersion = () => DeviceInfo.getVersion();
