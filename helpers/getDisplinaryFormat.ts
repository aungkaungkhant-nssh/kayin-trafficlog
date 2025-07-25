const getDisciplinaryFormat = (articleLabel: string, committedLabel: string) => {
    return `${articleLabel}/ (${committedLabel})`
}

export default getDisciplinaryFormat;