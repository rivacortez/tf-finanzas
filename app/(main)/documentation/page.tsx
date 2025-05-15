import { Metadata } from "next";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "EduBono | Documentación",
  description: "Información sobre el método francés y bonos educativos",
};

export default function DocumentationPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Documentación
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Información técnica sobre el sistema de bonos educativos, método francés y normativas aplicables.
        </p>
      </div>

      <Tabs defaultValue="metodo" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="metodo">Método Francés</TabsTrigger>
          <TabsTrigger value="normativa">Normativa SBS</TabsTrigger>
          <TabsTrigger value="indicadores">Indicadores Financieros</TabsTrigger>
          <TabsTrigger value="glosario">Glosario</TabsTrigger>
        </TabsList>
        
        {/* Método Francés */}
        <TabsContent value="metodo">
          <Card>
            <CardHeader>
              <CardTitle>Método Francés (Cuota constante)</CardTitle>
              <CardDescription>
                Sistema de amortización de cuotas constantes y amortización progresiva
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">¿Qué es el método francés?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                El método francés, también conocido como sistema de amortización con cuotas constantes, es un 
                sistema donde el prestatario paga la misma cantidad cada período, pero con una distribución 
                cambiante entre capital e intereses.
              </p>
              
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6">Características principales</h3>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>
                  <strong>Cuota constante:</strong> Todas las cuotas tienen el mismo importe durante todo el período de amortización.
                </li>
                <li>
                  <strong>Amortización progresiva:</strong> La amortización del capital va aumentando en cada período.
                </li>
                <li>
                  <strong>Intereses decrecientes:</strong> Los intereses van disminuyendo en cada período.
                </li>
              </ul>
              
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6">Fórmula para el cálculo de la cuota</h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-center text-gray-900 dark:text-gray-300 font-mono">
                  C = P * [ i * (1 + i)^n ] / [ (1 + i)^n - 1 ]
                </p>
                
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Donde:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>C</strong> = Cuota a pagar (constante)</li>
                    <li><strong>P</strong> = Principal o capital del préstamo</li>
                    <li><strong>i</strong> = Tasa de interés por período</li>
                    <li><strong>n</strong> = Número de períodos totales</li>
                  </ul>
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6">Ejemplo de aplicación</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Para un bono de S/ 10,000 a 24 meses con una TEA del 12%:
              </p>
              
              <p className="text-gray-600 dark:text-gray-400">
                1. Convertimos la TEA a tasa mensual: i = (1 + 0.12)^(1/12) - 1 = 0.00949 (0.949% mensual)
              </p>
              
              <p className="text-gray-600 dark:text-gray-400">
                2. Aplicamos la fórmula: C = 10,000 * [0.00949 * (1 + 0.00949)^24] / [(1 + 0.00949)^24 - 1] = S/ 470.73
              </p>
              
              <p className="text-gray-600 dark:text-gray-400">
                3. Generamos el cronograma de pagos donde cada mes se paga S/ 470.73, dividido entre amortización e intereses.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Normativa SBS */}
        <TabsContent value="normativa">
          <Card>
            <CardHeader>
              <CardTitle>Normativa SBS aplicable</CardTitle>
              <CardDescription>
                Resoluciones y circulares que regulan los bonos educativos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Resolución SBS N° 3274-2017</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Reglamento de Gestión de Conducta de Mercado del Sistema Financiero que establece los criterios de 
                transparencia de información y prácticas de negocio que deben adoptar las empresas financieras.
              </p>
              
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6">Circular SBS N° G-200-2020</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Establece disposiciones sobre la información que deben brindar las empresas supervisadas respecto 
                a comisiones, gastos y productos financieros.
              </p>
              
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6">Ley N° 31143</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Ley que protege de la usura a los consumidores de los servicios financieros, estableciendo tasas máximas 
                de interés.
              </p>
              
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6">Requisitos clave para cumplimiento normativo</h3>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>
                  <strong>Transparencia:</strong> Informar claramente sobre tasas, comisiones y gastos.
                </li>
                <li>
                  <strong>TCEA:</strong> Mostrar la Tasa de Costo Efectivo Anual en toda publicidad y contratos.
                </li>
                <li>
                  <strong>Hoja Resumen:</strong> Entregar un documento que resuma las condiciones del bono.
                </li>
                <li>
                  <strong>Plazos de gracia:</strong> Regular adecuadamente los períodos de gracia.
                </li>
                <li>
                  <strong>ITF:</strong> Incluir el Impuesto a las Transacciones Financieras en el cálculo.
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Indicadores Financieros */}
        <TabsContent value="indicadores">
          <Card>
            <CardHeader>
              <CardTitle>Indicadores Financieros</CardTitle>
              <CardDescription>
                Métricas utilizadas para evaluar bonos educativos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">TCEA (Tasa de Costo Efectivo Anual)</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Representa el costo total del crédito expresado como porcentaje anual. Incluye la tasa de interés, 
                comisiones, seguros y otros gastos. Se calcula igualando el valor presente de los flujos de pago 
                con el monto del préstamo.
              </p>
              
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6">TREA (Tasa de Rendimiento Efectivo Anual)</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Representa el rendimiento efectivo que obtiene el inversionista del bono. Considera todos los flujos 
                de caja y representa la tasa interna de retorno (TIR) de la inversión.
              </p>
              
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6">Duración de Macaulay</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Mide el tiempo promedio ponderado en que se recupera la inversión, ponderando cada flujo por su valor 
                presente. Se expresa en años y ayuda a entender cuándo se recupera en promedio el capital invertido.
              </p>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-2">
                <p className="text-center text-gray-900 dark:text-gray-300 font-mono">
                  D = Σ [ t * (FC_t / (1+i)^t) ] / P
                </p>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>Donde FC_t es el flujo de caja en el tiempo t, i es la tasa y P es el precio del bono.</p>
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6">Duración Modificada</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Mide la sensibilidad del precio del bono a cambios en la tasa de interés. Es la duración de Macaulay 
                dividida por (1 + rendimiento). Se interpreta como el cambio porcentual en el precio del bono ante un 
                cambio de 1% en la tasa.
              </p>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-2">
                <p className="text-center text-gray-900 dark:text-gray-300 font-mono">
                  DM = D / (1 + i)
                </p>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6">Convexidad</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Mide la curvatura de la relación entre el precio del bono y su rendimiento. Es una medida de segundo 
                orden que complementa la duración modificada, especialmente útil para grandes cambios en tasas de interés.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Glosario */}
        <TabsContent value="glosario">
          <Card>
            <CardHeader>
              <CardTitle>Glosario de términos financieros</CardTitle>
              <CardDescription>
                Conceptos clave relacionados con bonos educativos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Términos generales</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="font-medium text-gray-900 dark:text-white">Bono educativo</dt>
                      <dd className="text-gray-600 dark:text-gray-400 mt-1">
                        Instrumento de deuda emitido para financiar estudios académicos.
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-900 dark:text-white">Cuota</dt>
                      <dd className="text-gray-600 dark:text-gray-400 mt-1">
                        Pago periódico que incluye amortización del capital e intereses.
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-900 dark:text-white">Amortización</dt>
                      <dd className="text-gray-600 dark:text-gray-400 mt-1">
                        Parte de la cuota destinada a reducir el capital pendiente.
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-900 dark:text-white">Interés</dt>
                      <dd className="text-gray-600 dark:text-gray-400 mt-1">
                        Costo por el uso del dinero, expresado como porcentaje.
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-900 dark:text-white">Plazo</dt>
                      <dd className="text-gray-600 dark:text-gray-400 mt-1">
                        Tiempo total para la devolución del capital e intereses.
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-900 dark:text-white">Período de gracia</dt>
                      <dd className="text-gray-600 dark:text-gray-400 mt-1">
                        Tiempo durante el cual no se paga capital, solo intereses (parcial) o ningún pago (total).
                      </dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tasas e indicadores</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="font-medium text-gray-900 dark:text-white">TEA</dt>
                      <dd className="text-gray-600 dark:text-gray-400 mt-1">
                        Tasa Efectiva Anual. Tasa de interés anualizada que incluye la capitalización.
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-900 dark:text-white">TNA</dt>
                      <dd className="text-gray-600 dark:text-gray-400 mt-1">
                        Tasa Nominal Anual. Tasa simple anual que no incluye capitalización.
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-900 dark:text-white">TCEA</dt>
                      <dd className="text-gray-600 dark:text-gray-400 mt-1">
                        Tasa de Costo Efectivo Anual. Incluye intereses, comisiones y gastos.
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-900 dark:text-white">TIR</dt>
                      <dd className="text-gray-600 dark:text-gray-400 mt-1">
                        Tasa Interna de Retorno. Tasa que iguala el valor presente de los flujos futuros con la inversión inicial.
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-900 dark:text-white">Capitalización</dt>
                      <dd className="text-gray-600 dark:text-gray-400 mt-1">
                        Frecuencia con que los intereses se suman al capital para generar nuevos intereses.
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-900 dark:text-white">ITF</dt>
                      <dd className="text-gray-600 dark:text-gray-400 mt-1">
                        Impuesto a las Transacciones Financieras. Actualmente es 0.005% en Perú.
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 