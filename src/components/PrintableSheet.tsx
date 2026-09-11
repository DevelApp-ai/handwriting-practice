import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Printer, Download, X } from '@phosphor-icons/react'
import { LANGUAGES, getLanguageByCode, LanguageCategory } from '@/lib/languages'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { TracingGlyph } from '@/components/TracingGlyph'
import { QrCanvas } from '@/components/QrCanvas'
import { encodeSheetMetadata } from '@/lib/qr'

interface PrintableSheetProps {
  isOpen: boolean
  onClose: () => void
  selectedLanguage: string
}

function CornerFiducials() {
  const corner = 'absolute w-5 h-5 border-gray-500'
  return (
    <div className="pointer-events-none absolute inset-2">
      <div className={`${corner} top-0 left-0 border-l-2 border-t-2`} />
      <div className={`${corner} top-0 right-0 border-r-2 border-t-2`} />
      <div className={`${corner} bottom-0 left-0 border-l-2 border-b-2`} />
      <div className={`${corner} bottom-0 right-0 border-r-2 border-b-2`} />
    </div>
  )
}

export function PrintableSheet({ isOpen, onClose, selectedLanguage }: PrintableSheetProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [gridSize, setGridSize] = useState<'3x3' | '4x4' | '6x6'>('4x4')
  const [includeStrokeGuides, setIncludeStrokeGuides] = useState(true)
  const [includeCharacterName, setIncludeCharacterName] = useState(true)
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([])
  const printableRef = useRef<HTMLDivElement>(null)

  const currentLanguage = getLanguageByCode(selectedLanguage) || LANGUAGES[0]

  useEffect(() => {
    if (isOpen) {
      setSelectedCategories([])
      setSelectedCharacters([])
    }
  }, [isOpen, selectedLanguage])

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleSelectAllCategories = () => {
    setSelectedCategories(currentLanguage.categories.map(c => c.id))
  }

  const handleClearAllCategories = () => {
    setSelectedCategories([])
  }

  const getCharactersFromCategories = (): string[] => {
    const chars: string[] = []
    for (const category of currentLanguage.categories) {
      if (selectedCategories.includes(category.id)) {
        chars.push(...category.characters)
      }
    }
    return chars
  }

  const handleSelectAllCharacters = () => {
    const chars = getCharactersFromCategories()
    setSelectedCharacters(chars)
  }

  const handleClearAllCharacters = () => {
    setSelectedCharacters([])
  }

  const handleCharacterToggle = (character: string) => {
    setSelectedCharacters(prev =>
      prev.includes(character)
        ? prev.filter(c => c !== character)
        : [...prev, character]
    )
  }

  const getGridColumns = () => {
    switch (gridSize) {
      case '3x3': return 3
      case '4x4': return 4
      default: return 6
    }
  }

  const printSheet = async () => {
    if (!printableRef.current) return

    const canvas = await html2canvas(printableRef.current, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const ratio = canvas.width / canvas.height

    let width = pdfWidth - 20
    let height = width / ratio

    if (height > pdfHeight - 20) {
      height = pdfHeight - 20
      width = height * ratio
    }

    pdf.addImage(imgData, 'PNG', 10, 10, width, height)
    pdf.save(`handwriting-practice-${selectedLanguage}-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const handlePrint = () => {
    window.print()
  }

  const getCategoryById = (id: string): LanguageCategory | undefined => {
    return currentLanguage.categories.find(c => c.id === id)
  }

  const cols = getGridColumns()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Printable Training Sheet</DialogTitle>
          <DialogDescription>
            Select characters to include in your printable handwriting practice sheet.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Category Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Select Categories</h3>
            <div className="flex gap-2 mb-3">
              <Button variant="outline" size="sm" onClick={handleSelectAllCategories}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearAllCategories}>
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-3">
              {currentLanguage.categories.map(category => (
                <Label key={category.id} className="flex items-center gap-2 cursor-pointer border p-2 rounded-lg">
                  <Checkbox
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <span>{category.name}</span>
                </Label>
              ))}
            </div>
          </div>

          {/* Character Selection */}
          {selectedCategories.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Select Characters</h3>
              <div className="flex gap-2 mb-3">
                <Button variant="outline" size="sm" onClick={handleSelectAllCharacters}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearAllCharacters}>
                  Clear All
                </Button>
              </div>
              <div className="max-h-64 overflow-y-auto border rounded-lg p-4 bg-muted/50">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  {getCharactersFromCategories().map(char => (
                    <Label key={char} className="flex items-center gap-2 cursor-pointer p-2 rounded border bg-background">
                      <Checkbox
                        checked={selectedCharacters.includes(char)}
                        onCheckedChange={() => handleCharacterToggle(char)}
                      />
                      <span className="truncate">{char}</span>
                    </Label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Layout Options */}
          {selectedCharacters.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Layout Options</h3>
              <div className="space-y-4">
                <div>
                  <Label className="block mb-2">Grid Size</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={gridSize === '3x3' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setGridSize('3x3')}
                    >
                      3x3
                    </Button>
                    <Button
                      variant={gridSize === '4x4' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setGridSize('4x4')}
                    >
                      4x4
                    </Button>
                    <Button
                      variant={gridSize === '6x6' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setGridSize('6x6')}
                    >
                      6x6
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Checkbox
                    id="stroke-guides"
                    checked={includeStrokeGuides}
                    onCheckedChange={setIncludeStrokeGuides}
                  />
                  <Label htmlFor="stroke-guides">Include stroke order guides</Label>
                </div>

                <div className="flex items-center gap-4">
                  <Checkbox
                    id="character-name"
                    checked={includeCharacterName}
                    onCheckedChange={setIncludeCharacterName}
                  />
                  <Label htmlFor="character-name">Include character/word name</Label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Printable Preview */}
        {selectedCharacters.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Preview</h3>
            <div
              ref={printableRef}
              className="relative bg-white p-6 border rounded-lg shadow-lg"
              style={{ fontFamily: currentLanguage.fontFamily || 'sans-serif' }}
            >
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  {currentLanguage.nativeName} Handwriting Practice
                </h1>
                <p className="text-gray-600">
                  {currentLanguage.name} - {new Date().toLocaleDateString()}
                </p>
              </div>

              <div
                className={`grid gap-4`}
                style={{
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                }}
              >
                {selectedCharacters.map((char, index) => (
                  <div key={index} className="border border-gray-300 p-4 rounded-lg min-h-[120px]">
                    {includeCharacterName && (
                      <div className="text-xs text-gray-500 text-center mb-2">
                        {char}
                      </div>
                    )}
                    <div className="flex-1 flex items-center justify-center">
                      {includeStrokeGuides && char.length === 1 ? (
                        <TracingGlyph
                          char={char}
                          size={96}
                          showDots={includeStrokeGuides}
                          fallbackFont={currentLanguage.fontFamily}
                        />
                      ) : (
                        <span
                          className="text-4xl"
                          style={{
                            fontFamily: currentLanguage.fontFamily,
                          }}
                        >
                          {char}
                        </span>
                      )}
                    </div>
                    {includeStrokeGuides && (
                      <div className="text-xs text-gray-400 text-center mt-2">
                        Trace the character
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex items-end justify-between">
                <div className="text-xs text-gray-500">
                  Practice regularly to improve your handwriting! | www.weriteright.app
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right text-[10px] text-gray-500 leading-tight">
                    <div>Sheet ID</div>
                    <div className="font-mono">{selectedCharacters.length} chars</div>
                  </div>
                  <QrCanvas
                    text={encodeSheetMetadata({ charList: selectedCharacters })}
                    size={80}
                  />
                </div>
              </div>

              <CornerFiducials />
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
          {selectedCharacters.length > 0 && (
            <>
              <Button variant="secondary" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button onClick={printSheet}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
