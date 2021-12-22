{{/*
Expand the name of the chart.
*/}}
{{- define "debio-customer-ui.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "debio-customer-ui.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "debio-customer-ui.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "debio-customer-ui.labels" -}}
helm.sh/chart: {{ include "debio-customer-ui.chart" . }}
{{ include "debio-customer-ui.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "debio-customer-ui.selectorLabels" -}}
app.kubernetes.io/name: {{ include "debio-customer-ui.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "debio-customer-ui.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "debio-customer-ui.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of recaptchaSiteKey secret.
*/}}
{{- define "debio-customer-ui.recaptchaSiteKeySecretName" -}}
{{- printf "%s-%s" (include "debio-customer-ui.fullname" .) "recaptcha-site-key" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create the name of debioEscrowETHAddress secret.
*/}}
{{- define "debio-customer-ui.debioEscrowETHAddressSecretName" -}}
{{- printf "%s-%s" (include "debio-customer-ui.fullname" .) "debio-escrow-eth-address" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create the name of debioApiKey secret.
*/}}
{{- define "debio-customer-ui.debioApiKeySecretName" -}}
{{- printf "%s-%s" (include "debio-customer-ui.fullname" .) "debio-api-key" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}
