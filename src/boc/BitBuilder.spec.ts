import { BitBuilder } from "./BitBuilder";



describe('BitBuilder', () => {
    it('should serialize uint', () => {
        let cases: [number, number, string][] = [
            [10290, 29, '00014194_'],
            [41732, 27, '0014609_'],
            [62757, 22, '03D496_'],
            [44525, 16, 'ADED'],
            [26925, 30, '0001A4B6_'],
            [52948, 27, '0019DA9_'],
            [12362, 20, '0304A'],
            [31989, 16, '7CF5'],
            [8503, 21, '0109BC_'],
            [54308, 17, '6A124_'],
            [61700, 25, '0078824_'],
            [63112, 20, '0F688'],
            [27062, 29, '00034DB4_'],
            [37994, 30, '000251AA_'],
            [47973, 27, '00176CB_'],
            [18996, 25, '00251A4_'],
            [34043, 21, '0427DC_'],
            [8234, 18, '080AA_'],
            [16218, 26, '000FD6A_'],
            [40697, 25, '004F7CC_'],
            [43740, 27, '00155B9_'],
            [35773, 31, '0001177B_'],
            [32916, 18, '20252_'],
            [1779, 24, '0006F3'],
            [35968, 17, '46404_'],
            [15503, 23, '00791F_'],
            [25860, 21, '032824_'],
            [20651, 29, '0002855C_'],
            [14369, 16, '3821'],
            [28242, 24, '006E52'],
            [28446, 18, '1BC7A_'],
            [48685, 16, 'BE2D'],
            [54822, 18, '3589A_'],
            [50042, 22, '030DEA_'],
            [11024, 30, '0000AC42_'],
            [44958, 26, '002BE7A_'],
            [20297, 27, '0009E93_'],
            [24757, 16, '60B5'],
            [36043, 29, '0004665C_'],
            [24210, 16, '5E92'],
            [49621, 29, '00060EAC_'],
            [63571, 17, '7C29C_'],
            [16047, 24, '003EAF'],
            [61384, 27, '001DF91_'],
            [57607, 25, '007083C_'],
            [32945, 30, '000202C6_'],
            [31215, 29, '0003CF7C_'],
            [3088, 21, '006084_'],
            [45519, 24, '00B1CF'],
            [53126, 26, '0033E1A_']
        ];
        for (let c of cases) {
            let builder = new BitBuilder();
            builder.writeUint(c[0], c[1]);
            let bits = builder.build();
            expect(bits.toString()).toBe(c[2]);
        }
    })
    it('should serialize int', () => {
        const cases: [number, number, string][] = [
            [-44028, 22, 'FD5012_'],
            [-1613, 16, 'F9B3'],
            [-3640, 23, 'FFE391_'],
            [45943, 22, '02CDDE_'],
            [-25519, 22, 'FE7146_'],
            [-31775, 31, 'FFFF07C3_'],
            [3609, 29, '000070CC_'],
            [-38203, 20, 'F6AC5'],
            [59963, 28, '000EA3B'],
            [-22104, 21, 'FD4D44_'],
            [1305, 21, '0028CC_'],
            [-40704, 30, 'FFFD8402_'],
            [39319, 20, '09997'],
            [-39280, 27, 'FFECD21_'],
            [48805, 21, '05F52C_'],
            [-47386, 21, 'FA3734_'],
            [-24541, 22, 'FE808E_'],
            [-11924, 30, 'FFFF45B2_'],
            [16173, 22, '00FCB6_'],
            [25833, 23, '00C9D3_'],
            [27830, 22, '01B2DA_'],
            [50784, 31, '00018CC1_'],
            [-41292, 22, 'FD7AD2_'],
            [-8437, 20, 'FDF0B'],
            [-42394, 19, 'EB4CD_'],
            [14663, 26, '000E51E_'],
            [-52314, 25, 'FF99D34_'],
            [22649, 31, '0000B0F3_'],
            [-60755, 19, 'E255B_'],
            [-28966, 17, 'C76D4_'],
            [44151, 20, '0AC77'],
            [22112, 26, '0015982_'],
            [25524, 19, '0C769_'],
            [55597, 23, '01B25B_'],
            [4434, 28, '0001152'],
            [28364, 29, '00037664_'],
            [-5431, 25, 'FFF564C_'],
            [35945, 17, '4634C_'],
            [49508, 19, '182C9_'],
            [-54454, 30, 'FFFCAD2A_'],
            [-62846, 22, 'FC2A0A_'],
            [-11725, 28, 'FFFD233'],
            [-25980, 30, 'FFFE6A12_'],
            [56226, 30, '00036E8A_'],
            [64224, 27, '001F5C1_'],
            [-52385, 29, 'FFF99AFC_'],
            [33146, 24, '00817A'],
            [-4383, 27, 'FFFDDC3_'],
            [4617, 23, '002413_'],
            [-20390, 21, 'FD82D4_']
        ];
        for (let c of cases) {
            let builder = new BitBuilder();
            builder.writeInt(c[0], c[1]);
            let bits = builder.build();
            expect(bits.toString()).toBe(c[2]);
        }
    });

    it('should serialize coins', () => {
        const cases: [string, string][] = [
            ['187657898555727', '6AAAC8261F94F'],
            ['220186135208421', '6C842145FA1E5'],
            ['38303065322130', '622D6209A3292'],
            ['99570315572129', '65A8F054A33A1'],
            ['14785390105803', '60D727DECD4CB'],
            ['244446854605494', '6DE52B7EF6AB6'],
            ['130189848588337', '676682FADB031'],
            ['82548661242881', '64B13DBA14C01'],
            ['248198532456807', '6E1BC395C6167'],
            ['192570661887521', '6AF2459E55E21'],
            ['72100014883174', '6419317C68166'],
            ['216482443674661', '6C4E3BF27C425'],
            ['11259492167296', '60A3D8E07EE80'],
            ['89891460221935', '651C17C8E0BEF'],
            ['267747267722164', '6F383C4C83BB4'],
            ['33545710125130', '61E827822C04A'],
            ['48663481749259', '62C42598B0F0B'],
            ['4122277458487', '603BFCAE23237'],
            ['112985911164954', '666C29519801A'],
            ['262936671139040', '6EF23B6E1B4E0'],
            ['137598454214999', '67D2522FC3157'],
            ['164191836706277', '69554E41A15E5'],
            ['225097218341260', '6CCB987BD398C'],
            ['253225616389304', '6E64EAEE9B4B8'],
            ['89031277771089', '650F935AF7951'],
            ['95175307882302', '6568FBA6AEF3E'],
            ['129805848629999', '6760EC77F52EF'],
            ['144714620593360', '6839DFF8DE4D0'],
            ['245178977211193', '6DEFD2DD7D339'],
            ['85630758278876', '64DE176EDD6DC'],
            ['12826827848685', '60BAA7A847BED'],
            ['112520990974580', '6665655B26274'],
            ['279110697598724', '6FDD985FBBF04'],
            ['213631116095525', '6C24BDEC9B025'],
            ['151538088541111', '689D2B5EFFBB7'],
            ['248258622846989', '6E1CA3706F80D'],
            ['124738812119884', '6717304960B4C'],
            ['20802268076562', '612EB67CC9A12'],
            ['227545530657711', '6CEF392866BAF'],
            ['120231499052120', '66D5993CAB458'],
            ['149349897829611', '687D53B9B7CEB'],
            ['189858289788838', '6ACACD3EBA7A6'],
            ['123762285255173', '6708FA70C9A05'],
            ['70958099290717', '64089384D5A5D'],
            ['124643854909101', '6715CE8B1FEAD'],
            ['7092186021168', '60673473A7D30'],
            ['52349283250349', '62F9C846EB0AD'],
            ['151939404432691', '68A30263A8533'],
            ['31720663732116', '61CD98AE4CF94'],
            ['132368134922315', '678635BA9604B']
        ];
        for (let c of cases) {
            let builder = new BitBuilder();
            builder.writeCoins(BigInt(c[0]));
            let bits = builder.build();
            expect(bits.toString()).toBe(c[1]);
        }
    })
});