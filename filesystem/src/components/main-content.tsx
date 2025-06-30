"use client";

import { useEffect, useState } from "react";
import { FolderCard } from "@/components/folder-card";
import { Button } from "@/components/ui/button";
import { List, Info, Settings, HardDrive, ArrowLeft } from "lucide-react";
import { fileService } from "@/api/upload/fileServices";
import { crearCarpeta, compartirCarpeta, listarCarpetas } from "@/api/carpeta/folder";
import { authService } from "@/api/login/auth";
import { NewButton } from "@/components/new-button";
import { Modal } from "@/components/Modal";

interface Archivo {
  nombre: string;
  extension: string;
  contenido: string;
  fechaCreacion: string;
  fechaModificacion: string;
  tamano: number;
}

interface Carpeta {
  nombre: string;
}

export function MainContent() {
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [carpetas, setCarpetas] = useState<Carpeta[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("root");
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<Archivo | null>(null);

  const [modal, setModal] = useState<{
    visible: boolean;
    title: string;
    description: string;
    onConfirm?: () => void;
  }>({
    visible: false,
    title: "",
    description: "",
  });

  const [inputModal, setInputModal] = useState<{
    visible: boolean;
    title: string;
    placeholder: string;
    onConfirm?: (value: string) => void;
  }>({
    visible: false,
    title: "",
    placeholder: "",
  });

  useEffect(() => {
    const cargarContenido = async () => {
      try {
        const user = authService.getUserData();
        if (!user) return;

        const archivosData = await fileService.listarArchivos(currentPath);
        const carpetasData = await listarCarpetas(user.nombre, currentPath);

        setArchivos(archivosData);
        setCarpetas(carpetasData);
      } catch (error) {
        console.error("Error al cargar contenido:", error);
      }
    };
    cargarContenido();
  }, [currentPath]);

  const handleAbrirCarpeta = (nombreCarpeta: string) => {
    setCurrentPath((prev) => `${prev}/${nombreCarpeta}`);
  };

  const handleAtras = () => {
    if (currentPath === "root") return;
    const partes = currentPath.split("/");
    partes.pop();
    setCurrentPath(partes.join("/") || "root");
  };

  return (
    <main className="flex-1 bg-gray-50">
      {/* barra superior */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-2">
          {currentPath !== "root" && (
            <Button variant="ghost" onClick={handleAtras}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Atrás
            </Button>
          )}
        </div>
        <NewButton 
          currentPath={currentPath}
          onArchivoCreado={() => {
            // Recargar archivos tras crear uno nuevo
            fileService.listarArchivos(currentPath).then(setArchivos)
          }} />
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-gray-600">
            <List className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600">
            <Info className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* ruta */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <HardDrive className="h-6 w-6 text-gray-600 mr-2" />
            <h1 className="text-2xl font-normal text-gray-800">Mi unidad</h1>
          </div>
          <p className="text-gray-600">Ruta actual: {currentPath}</p>
        </div>

        {/* carpetas */}
        {carpetas.length > 0 && (
          <div className="mb-4">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Carpetas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {carpetas.map((carpeta, index) => (
                <FolderCard
                  key={`folder-${index}`}
                  name={carpeta.nombre}
                  type="folder"
                  onClick={() => handleAbrirCarpeta(carpeta.nombre)}
                >
                  <div className="flex justify-center mt-2 w-full gap-1 flex-wrap">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInputModal({
                          visible: true,
                          title: "Mover carpeta",
                          placeholder: "Destino (ej: root/fotos)",
                          onConfirm: (valor) => {
                            if (!valor) return;
                            fileService.moverCarpeta({
                              origenPath: `${currentPath}/${carpeta.nombre}`,
                              destinoPath: valor,
                            }).then((res) => {
                              if (res.success) {
                                setCarpetas((prev) => prev.filter((c) => c.nombre !== carpeta.nombre));
                                setModal({
                                  visible: true,
                                  title: "Éxito",
                                  description: "Carpeta movida correctamente",
                                });
                              } else {
                                setModal({
                                  visible: true,
                                  title: "Error",
                                  description: res.message || "No se pudo mover carpeta",
                                });
                              }
                            });
                          },
                        });
                      }}
                    >
                      Mover
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInputModal({
                          visible: true,
                          title: "Compartir carpeta",
                          placeholder: "Usuario destino",
                          onConfirm: (valor) => {
                            if (!valor) return;
                            const user = authService.getUserData();
                            if (!user) return;
                            compartirCarpeta(user.nombre, `${currentPath}/${carpeta.nombre}`, valor).then((res) => {
                              setModal({
                                visible: true,
                                title: res.success ? "Éxito" : "Error",
                                description: res.message || "Acción completada",
                              });
                            });
                          },
                        });
                      }}
                    >
                      Compartir
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModal({
                          visible: true,
                          title: `¿Confirmar eliminación de carpeta?`,
                          description: carpeta.nombre,
                          onConfirm: async () => {
                            const res = await fileService.eliminarCarpeta({
                              path: `${currentPath}/${carpeta.nombre}`,
                            });
                            if (res.success) {
                              setCarpetas((prev) => prev.filter((c) => c.nombre !== carpeta.nombre));
                              setModal({
                                visible: true,
                                title: "Éxito",
                                description: "Carpeta eliminada correctamente",
                              });
                            } else {
                              setModal({
                                visible: true,
                                title: "Error",
                                description: res.message || "No se pudo eliminar carpeta",
                              });
                            }
                          },
                        });
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                </FolderCard>
              ))}
            </div>
          </div>
        )}

        {/* archivos */}
        <div className="mb-4">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Archivos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {archivos.length > 0 ? (
              archivos.map((archivo, index) => (
                <FolderCard key={`file-${index}`} name={`${archivo.nombre}.${archivo.extension}`} type="file">
                  <div className="flex flex-col gap-2 mt-2 w-full">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileService.descargarArchivo({
                          nombre: archivo.nombre,
                          extension: archivo.extension,
                          path: currentPath,
                        });
                      }}
                    >
                      Descargar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModal({
                          visible: true,
                          title: `¿Eliminar archivo?`,
                          description: archivo.nombre,
                          onConfirm: async () => {
                            const res = await fileService.eliminarArchivo({
                              nombre: archivo.nombre,
                              extension: archivo.extension,
                              path: currentPath,
                            });
                            if (res.success) {
                              setArchivos((prev) =>
                                prev.filter((a) => !(a.nombre === archivo.nombre && a.extension === archivo.extension))
                              );
                            }
                          },
                        });
                      }}
                    >
                      Eliminar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInputModal({
                          visible: true,
                          title: "Copiar archivo",
                          placeholder: "Destino",
                          onConfirm: (valor) => {
                            if (!valor) return;
                            fileService
                              .copiarArchivo({
                                origenPath: currentPath,
                                destinoPath: valor,
                                nombre: archivo.nombre,
                                extension: archivo.extension,
                              })
                              .then((res) =>
                                setModal({
                                  visible: true,
                                  title: res.success ? "Éxito" : "Error",
                                  description: res.message || "Acción completada",
                                })
                              );
                          },
                        });
                      }}
                    >
                      Copiar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInputModal({
                          visible: true,
                          title: "Mover archivo",
                          placeholder: "Destino",
                          onConfirm: (valor) => {
                            if (!valor) return;
                            fileService
                              .moverArchivo({
                                origenPath: currentPath,
                                destinoPath: valor,
                                nombre: archivo.nombre,
                                extension: archivo.extension,
                              })
                              .then((res) => {
                                if (res.success) {
                                  setArchivos((prev) =>
                                    prev.filter(
                                      (a) => !(a.nombre === archivo.nombre && a.extension === archivo.extension)
                                    )
                                  );
                                  setModal({
                                    visible: true,
                                    title: "Éxito",
                                    description: "Archivo movido correctamente",
                                  });
                                } else {
                                  setModal({
                                    visible: true,
                                    title: "Error",
                                    description: res.message || "No se pudo mover archivo",
                                  });
                                }
                              });
                          },
                        });
                      }}
                    >
                      Mover
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInputModal({
                          visible: true,
                          title: "Compartir archivo",
                          placeholder: "Usuario destino",
                          onConfirm: (valor) => {
                            if (!valor) return;
                            fileService
                              .compartirArchivo({
                                nombre: archivo.nombre,
                                extension: archivo.extension,
                                path: currentPath,
                                destinatario: valor,
                              })
                              .then((res) =>
                                setModal({
                                  visible: true,
                                  title: res.success ? "Éxito" : "Error",
                                  description: res.message || "Acción completada",
                                })
                              );
                          },
                        });
                      }}
                    >
                      Compartir
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInputModal({
                          visible: true,
                          title: "Modificar archivo",
                          placeholder: "Nuevo contenido",
                          onConfirm: (valor) => {
                            if (!valor) return;
                            fileService
                              .modificarArchivo({
                                nombre: archivo.nombre,
                                extension: archivo.extension,
                                path: currentPath,
                                nuevoContenido: valor,
                              })
                              .then((res) =>
                                setModal({
                                  visible: true,
                                  title: res.success ? "Éxito" : "Error",
                                  description: res.message || "Acción completada",
                                })
                              );
                          },
                        });
                      }}
                    >
                      Modificar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const nuevosDatos = await fileService.listarArchivos(currentPath);
                        const archivoActualizado = nuevosDatos.find(
                          (a) => a.nombre === archivo.nombre && a.extension === archivo.extension
                        );
                        if (archivoActualizado) setArchivoSeleccionado(archivoActualizado);
                      }}
                    >
                      Ver detalles
                    </Button>
                  </div>
                </FolderCard>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <HardDrive className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Esta carpeta está vacía</h3>
                <p className="text-gray-500">Usa el botón "Nuevo" para crear archivos y carpetas</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* modal confirmación */}
      <Modal
        isOpen={modal.visible}
        title={modal.title}
        onClose={() => setModal({ ...modal, visible: false, onConfirm: undefined })}
      >
        <div className="text-gray-600 mb-4">{modal.description}</div>
        <div className="flex justify-end space-x-2 mt-2">
          {modal.onConfirm && (
            <Button
              onClick={() => {
                modal.onConfirm?.();
                setModal({ ...modal, visible: false, onConfirm: undefined });
              }}
            >
              Confirmar
            </Button>
          )}
          <Button onClick={() => setModal({ ...modal, visible: false, onConfirm: undefined })}>Cerrar</Button>
        </div>
      </Modal>

      {/* modal input */}
      <Modal
        isOpen={inputModal.visible}
        title={inputModal.title}
        onClose={() => setInputModal({ ...inputModal, visible: false })}
      >
        <input
          type="text"
          placeholder={inputModal.placeholder}
          className="w-full border rounded p-2"
          id="inputModalField"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const valor = (e.target as HTMLInputElement).value;
              inputModal.onConfirm?.(valor);
              setInputModal({ ...inputModal, visible: false });
            }
          }}
        />
        <div className="flex justify-end mt-2 space-x-2">
          <Button
            onClick={() => {
              const input = document.getElementById("inputModalField") as HTMLInputElement | null;
              if (input) {
                inputModal.onConfirm?.(input.value);
                setInputModal({ ...inputModal, visible: false });
              }
            }}
          >
            Aplicar
          </Button>
          <Button onClick={() => setInputModal({ ...inputModal, visible: false })}>Cancelar</Button>
        </div>
      </Modal>


      {/* modal detalles archivo */}
      <Modal
        isOpen={!!archivoSeleccionado}
        title="Detalles del archivo"
        onClose={() => setArchivoSeleccionado(null)}
      >
        {archivoSeleccionado && (
          <ul className="text-sm text-gray-700 space-y-1">
            <li><strong>Nombre:</strong> {archivoSeleccionado.nombre}.{archivoSeleccionado.extension}</li>
            <li><strong>Tamaño:</strong> {archivoSeleccionado.tamano} bytes</li>
            <li><strong>Creado:</strong> {archivoSeleccionado.fechaCreacion}</li>
            <li><strong>Modificado:</strong> {archivoSeleccionado.fechaModificacion}</li>
            <li><strong>Contenido:</strong>
              <pre className="bg-gray-100 rounded p-2 mt-1 whitespace-pre-wrap break-words">{archivoSeleccionado.contenido}</pre>
            </li>
          </ul>
        )}
        <div className="flex justify-end mt-4">
          <Button onClick={() => setArchivoSeleccionado(null)}>Cerrar</Button>
        </div>
      </Modal>
    </main>
  );
}
