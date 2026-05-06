import React from "react";
import htm from "htm";
import { Link } from "react-router-dom";
import { PageLayout } from "../components/PageLayout.js";

const html = htm.bind(React.createElement);

export function AccountRequestSentPage() {
  return html`
    <${PageLayout} className="auth-layout">
      <section className="auth-page">
        <div className="auth-shell auth-shell--login">
          <aside className="auth-aside auth-aside--login">
            <span className="auth-tag">FORJA</span>
            <h1>Sua solicitacao foi enviada.</h1>
            <p>
              Agora um administrador da plataforma precisa analisar e liberar o seu acesso.
            </p>
          </aside>

          <div className="auth-card auth-card--login">
            <div className="auth-confirmation">
              <span className="auth-confirmation-icon">✓</span>
              <h1>Cadastro em analise</h1>
              <p>
                Assim que um dos admins aprovar seu cadastro, voce podera entrar com o e-mail e a
                senha definidos no formulario.
              </p>

              <div className="auth-confirmation-actions">
                <${Link} to="/livros" className="auth-submit">Voltar ao acervo</${Link}>
                <${Link} to="/entrar" className="auth-secondary-link">
                  Ja fui aprovado
                </${Link}>
              </div>
            </div>
          </div>
        </div>
      </section>
    <//>
  `;
}
