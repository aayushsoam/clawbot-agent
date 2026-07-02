[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()

function Build-LogoRow {
    param([string]$Pattern)
    $res = ""
    for ($i = 0; $i -lt $Pattern.Length; $i++) {
        $c = $Pattern[$i]
        switch ($c) {
            "M" { $res += [char]0x2588 } # █
            "L" { $res += [char]0x2591 } # ░
            "D" { $res += [char]0x2584 } # ▄
            "U" { $res += [char]0x2580 } # ▀
            "S" { $res += " " }          # space
            default { $res += $c }
        }
    }
    return $res
}

# segment patterns:
# C: Row 1 = MMLDDDMM, Row 2 = MMLMMMMM, Row 3 = MMLUUUMM
# L: Row 1 = MMLMMMMM, Row 2 = MMLMMMMM, Row 3 = MMLUUUUM
# A: Row 1 = MMLDDDMM, Row 2 = MMLUUUMM, Row 3 = MMLMMMMM
# W: Row 1 = MMLMMMLMMMLMM, Row 2 = MMLMMMLMMMLMM, Row 3 = MMLUUULUUULMM
# B: Row 1 = MMLDDDMM, Row 2 = MMLUUUMM, Row 3 = MMLUUUMM  (Wait, let's map loops)
# O: Row 1 = MMLDDDMM, Row 2 = MMLMMMMM, Row 3 = MMLUUUMM  (Wait, O has empty center: Row 2 = MMLMMMLMM)
# T: Row 1 = MMLUUUUMM, Row 2 = MMMMLMMMMM, Row 3 = MMMMLMMMMM

$C1 = "MMLDDDMM"
$L1 = "MMLMMMMM"
$A1 = "MMLDDDMLMM"
$W1 = "MMLMMMLMMMLMM"
$B1 = "MMLDDDMLMM"
$O1 = "MMLDDDMLMM"
$T1 = "MMLUUUUUMM"

$C2 = "MMLMMMMM"
$L2 = "MMLMMMMM"
$A2 = "MMLUUUMLMM"
$W2 = "MMLMMMLMMMLMM"
$B2 = "MMLUUUMMMM"
$O2 = "MMLMMMLMM"
$T2 = "MMMMLMMMMM"

$C3 = "MMLUUUMM"
$L3 = "MMLUUUUM"
$A3 = "MMLMMMLMM"
$W3 = "MMLUUULUUULMM"
$B3 = "MMLUUUMLMM"
$O3 = "MMLUUUMLMM"
$T3 = "MMMMLMMMMM"

$sep = "MM"

$row1 = $C1 + $sep + $L1 + $sep + $A1 + $sep + $W1 + $sep + $B1 + $sep + $O1 + $sep + $T1
$row2 = $C2 + $sep + $L2 + $sep + $A2 + $sep + $W2 + $sep + $B2 + $sep + $O2 + $sep + $T2
$row3 = $C3 + $sep + $L3 + $sep + $A3 + $sep + $W3 + $sep + $B3 + $sep + $O3 + $sep + $T3

$border = "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD"
$borderBottom = "UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU"

Write-Host (Build-LogoRow $border) -ForegroundColor Magenta
Write-Host (Build-LogoRow $row1) -ForegroundColor Magenta
Write-Host (Build-LogoRow $row2) -ForegroundColor Magenta
Write-Host (Build-LogoRow $row3) -ForegroundColor Magenta
Write-Host (Build-LogoRow $borderBottom) -ForegroundColor Magenta
