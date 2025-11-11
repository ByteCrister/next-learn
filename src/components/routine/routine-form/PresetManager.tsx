'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiTrash2, FiEdit, FiCheck, FiX, FiArchive, FiBook, FiUser, FiHome } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PresetItem, PresetKind, usePresets } from '@/hooks/usePresets'

export function PresetManager({
  initialKind = 'subject' as PresetKind,
  routeKey = '__default__' as string,
}: {
  initialKind?: PresetKind
  routeKey?: string
}) {
  const {
    listByKind,
    add,
    update,
    remove, // softDelete
    restore,
    purge,
    listDeleted,
  } = usePresets(routeKey)

  const [kind, setKind] = useState<PresetKind>(initialKind)
  const [value, setValue] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showTrash, setShowTrash] = useState(false)

  const items = showTrash ? listDeleted(kind) : listByKind(kind)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const kindOptions: PresetKind[] = ['subject', 'teacher', 'room']

  useEffect(() => {
    inputRef.current?.focus()
  }, [editingId, kind, showTrash])

  const resetInput = () => {
    setValue('')
    setEditingId(null)
  }

  const onAdd = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    add(kind, trimmed)
    resetInput()
    inputRef.current?.focus()
  }

  const onStartEdit = (it: PresetItem) => {
    setEditingId(it.id)
    setValue(it.label)
    inputRef.current?.focus()
  }

  const onSaveEdit = () => {
    if (!editingId) return
    const trimmed = value.trim()
    if (!trimmed) return
    update(editingId, { label: trimmed })
    resetInput()
  }

  const onCancelEdit = () => resetInput()

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (editingId) onSaveEdit()
      else onAdd()
    } else if (e.key === 'Escape') {
      onCancelEdit()
    }
  }

  const getKindIcon = (k: PresetKind) => {
    const iconClass = "w-3.5 h-3.5"
    switch(k) {
      case 'subject': return <FiBook className={iconClass} />
      case 'teacher': return <FiUser className={iconClass} />
      case 'room': return <FiHome className={iconClass} />
    }
  }

  const getKindColor = (k: PresetKind) => {
    switch(k) {
      case 'subject': return 'from-violet-500 to-purple-600'
      case 'teacher': return 'from-blue-500 to-cyan-600'
      case 'room': return 'from-emerald-500 to-teal-600'
    }
  }

  return (
    <Card className="w-full border shadow-sm bg-white dark:bg-slate-950">
      <CardHeader className="py-4 px-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Preset Manager
            </CardTitle>
            <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
              Organize subjects, teachers, and rooms
            </CardDescription>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant={showTrash ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setShowTrash((s) => !s)}
              className="gap-2 font-medium"
            >
              <FiArchive className="w-4 h-4" />
              {showTrash ? 'Active' : 'Trash'}
              <Badge variant="secondary" className="ml-0.5 text-xs">
                {showTrash ? listByKind(kind).length : listDeleted(kind).length}
              </Badge>
            </Button>
          </motion.div>
        </div>

        <div className="flex flex-wrap gap-2">
          {kindOptions.map((k) => (
            <motion.div key={k} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant={k === kind ? 'default' : 'outline'}
                size="sm"
                onClick={() => setKind(k)}
                className={`
                  font-medium transition-all
                  ${k === kind 
                    ? `bg-gradient-to-r ${getKindColor(k)} text-white border-0 shadow-md` 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-900'
                  }
                `}
              >
                <span className="flex items-center gap-1.5">
                  {getKindIcon(k)}
                  <span className="capitalize text-sm">{k}</span>
                  <Badge 
                    variant="secondary" 
                    className={`ml-0.5 text-xs ${k === kind ? 'bg-white/20 text-white border-0' : ''}`}
                  >
                    {listByKind(k).length}
                  </Badge>
                </span>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="py-3 px-5 space-y-4">
        {!showTrash && (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                {getKindIcon(kind)}
                <span>Add {kind.charAt(0).toUpperCase() + kind.slice(1)}</span>
              </Label>

              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={
                    kind === 'subject' ? 'e.g., Mathematics' : 
                    kind === 'teacher' ? 'e.g., Mr. Rahman' : 
                    'e.g., Room 101'
                  }
                  className="h-10 text-sm focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400"
                />

                <AnimatePresence mode="wait">
                  {editingId ? (
                    <motion.div 
                      key="edit-buttons" 
                      initial={{ opacity: 0, x: 10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -10 }} 
                      className="flex gap-2"
                    >
                      <Button 
                        onClick={onSaveEdit} 
                        size="sm"
                        className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-sm"
                      >
                        <FiCheck className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={onCancelEdit}
                        className="hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <FiX className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="add-button" 
                      initial={{ opacity: 0, x: 10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <Button 
                        onClick={onAdd} 
                        size="sm"
                        className={`bg-gradient-to-r ${getKindColor(kind)} text-white shadow-sm`}
                      >
                        <FiPlus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <Separator />
          </>
        )}

        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
          <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <motion.div 
                key="empty" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getKindColor(kind)} opacity-10 mb-3 flex items-center justify-center`}>
                  <div className="text-2xl opacity-50">{getKindIcon(kind)}</div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {showTrash ? `No deleted ${kind}s` : `No ${kind}s yet`}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {showTrash ? 'Trash is empty' : `Add your first ${kind} above`}
                </p>
              </motion.div>
            ) : (
              items.map((it, index) => (
                <motion.div
                  key={it.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -20 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ x: 2 }}
                  className="group"
                >
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm bg-white dark:bg-slate-900 transition-all">
                    <motion.div 
                      className={`w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center text-white font-semibold text-sm bg-gradient-to-br ${getKindColor(kind)} shadow-sm`}
                      whileHover={{ scale: 1.05, rotate: 3 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      {it.label.charAt(0).toUpperCase()}
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {it.label}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                        {it.id}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!showTrash ? (
                        <>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onStartEdit(it)}
                              className="h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-950"
                            >
                              <FiEdit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </Button>
                          </motion.div>

                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(it.id)}
                              className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                              <FiTrash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </Button>
                          </motion.div>
                        </>
                      ) : (
                        <>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => restore(it.id)}
                              className="h-8 w-8 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                              title="Restore"
                            >
                              <FiCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            </Button>
                          </motion.div>

                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => purge(it.id)}
                              className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-950"
                              title="Delete permanently"
                            >
                              <FiTrash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </Button>
                          </motion.div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}